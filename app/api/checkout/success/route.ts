import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

//購入履歴の保存
export async function POST(request: Request, response: Response){
  const { sessionId } = await request.json();
  
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const existingPurchase = prisma.purchase.findFirst({
      where:{
        userId: session.client_reference_id!,
        bookId: session.metadata?.bookId!,
      },
    });

    console.log(session);

    //購入履歴がない場合
    if(!existingPurchase){
      const purchase = await prisma.purchase.create({
        data:{
          userId: session.client_reference_id!,
          bookId: session.metadata?.bookId!,
        },
      });
    return NextResponse.json({ purchase });            
    } else {
      // 既に購入履歴が存在する場合の処理
      return NextResponse.json({message:"すでに購入済みです"});
    }  
  } catch (err:any) {
    return NextResponse.json(err);
  }
}