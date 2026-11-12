import Header from "./(components)/header/Header";
import HomeSections from "./(components)/home/HomeSections";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-slate-50">
      <Header />
      <HomeSections />
    </main>
  );
}
