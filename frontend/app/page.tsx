import Header from "./(components)/header/Header";
import HomeSections from "./(components)/home/HomeSections";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <Header />
      <HomeSections />
    </main>
  );
}
