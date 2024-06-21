// "use client";

import { getServerSession } from "next-auth";
import Book from "./Components/Book";
import { getAllBooks } from "./lib/microcms/client";
import { BookType, Purchase, User } from "./types/types";
import { nextAuthOptions } from "./lib/next-auth/options";


// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  const { contents } = await getAllBooks();

  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;//型キャスト（session?.userが存在するときだけ、userの型をつけることができる）
  //Sessionを呼び出す時も、useSessionの形で呼び出すのではなく
  //サーバーサイドでSessionを取り出す関数を使って、userを取り出す

  let purchaseBookIds: string[] = [];

  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
      { cache: "no-store" }
      //SSR(Nextjs13以降、fetchAPIの第2引数でcacheの形で指定する形)
    );
    const purchasesData = await response.json();
    // console.log(purchasesData);

    purchaseBookIds = purchasesData.map(
      (purchaseBook: Purchase) => purchaseBook.bookId
    );
    // console.log(purchaseBookIds);

  }

  return (
    <>
      <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">
          Book Commerce
        </h2>
        {contents.map((book: BookType) => (
          <Book
            key={book.id}
            book={book}
            isPurchased
            // isPurchased={purchaseBookIds.includes(book.id)}
            user={user}
          />
        ))}
      </main>
    </>
  );
}
