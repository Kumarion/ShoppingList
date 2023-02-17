import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import ShoppingList from "./shoppingList";
import { Button } from "@material-tailwind/react";

function OpenPage(page: string) {
  location.href = page;
}

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Shopping list project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            My <span className="text-[hsl(280,100%,70%)]">Shopping</span> List
          </h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href=""
            >
              <h3 className="text-2xl font-bold">Simple</h3>
              <div className="text-lg">
                Simple shopping list app with Next.js, React, TypeScript, and
                Tailwind CSS.
              </div>
            </Link>

            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href=""
            >
              <h3 className="text-2xl font-bold">Quality</h3>
              <div className="text-lg">
                Quality shopping list app with Next.js, React, TypeScript, and
                Tailwind CSS.
              </div>
            </Link>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {sessionData ? "Welcome" : "Get started by signing in"}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>

      <Button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>

      <Link href="/shoppingList">
        {sessionData && (
          <Button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
            My shopping lists
            </Button>
        )};
      </Link>
    </div>
  );
};

export default Home;