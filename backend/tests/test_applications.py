import pytest
from fastapi import BackgroundTasks, HTTPException
from sqlalchemy import create_engine, text

@pytest.fixture
def db(api, monkeypatch):
    engine = create_engine("sqlite://")
    with engine.begin() as conn:
        conn.execute(text("CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL)"))
        conn.execute(text("CREATE TABLE applications (id INTEGER PRIMARY KEY, student_id INTEGER NOT NULL, subject TEXT NOT NULL, class_name TEXT NOT NULL, status TEXT DEFAULT '승인대기', created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT)"))
        conn.execute(text("INSERT INTO students VALUES (1, '테스트학생'), (2, '다른학생')"))
    monkeypatch.setattr(api, "engine", engine)
    yield engine
    engine.dispose()

def test_new_application_maps_student_and_schedules_one_email(api, db):
    tasks = BackgroundTasks()
    result = api.apply_course(api.ApplicationCreate(subject=" 영어 ", class_name=" A반 "), tasks, 1)
    assert result['student']['student_id'] == 1
    assert result['student']['subject'] == '영어'
    assert result['student']['class_name'] == 'A반'
    assert len(tasks.tasks) == 1
    with db.connect() as conn:
        assert conn.execute(text("SELECT status FROM applications")).scalar_one() == '승인대기'

def test_duplicate_application_is_rejected(api, db):
    request = api.ApplicationCreate(subject='영어', class_name='A반')
    api.apply_course(request, BackgroundTasks(), 1)
    tasks = BackgroundTasks()
    with pytest.raises(HTTPException) as caught:
        api.apply_course(request, tasks, 1)
    assert caught.value.status_code == 409
    assert tasks.tasks == []
    with db.connect() as conn:
        assert conn.execute(text('SELECT COUNT(*) FROM applications')).scalar_one() == 1

def test_changing_class_requires_approval_again(api, db):
    api.apply_course(api.ApplicationCreate(subject='영어', class_name='A반'), BackgroundTasks(), 1)
    with db.begin() as conn:
        conn.execute(text("UPDATE applications SET status='승인완료'"))
    result = api.apply_course(api.ApplicationCreate(subject='영어', class_name='B반'), BackgroundTasks(), 1)
    assert result['student']['class_name'] == 'B반'
    assert result['student']['status'] == '승인대기'
    with db.connect() as conn:
        assert conn.execute(text('SELECT COUNT(*) FROM applications')).scalar_one() == 1

def test_missing_student_cannot_apply(api, db):
    with pytest.raises(HTTPException) as caught:
        api.apply_course(api.ApplicationCreate(subject='영어', class_name='A반'), BackgroundTasks(), 999)
    assert caught.value.status_code == 404

@pytest.mark.parametrize('status,allowed', [('승인대기', False), ('승인완료', True)])
def test_only_approved_student_can_access_lesson(api, db, status, allowed):
    api.apply_course(api.ApplicationCreate(subject='영어', class_name='A반'), BackgroundTasks(), 1)
    with db.begin() as conn:
        conn.execute(text('UPDATE applications SET status=:status'), {'status':status})
    if allowed:
        assert api.get_lesson_access(1)['applications'][0]['subject'] == '영어'
    else:
        with pytest.raises(HTTPException) as caught:
            api.get_lesson_access(1)
        assert caught.value.status_code == 403

def test_approval_of_other_student_does_not_grant_access(api, db):
    api.apply_course(api.ApplicationCreate(subject='영어', class_name='A반'), BackgroundTasks(), 2)
    with db.begin() as conn:
        conn.execute(text("UPDATE applications SET status='승인완료'"))
    with pytest.raises(HTTPException) as caught:
        api.get_lesson_access(1)
    assert caught.value.status_code == 403
