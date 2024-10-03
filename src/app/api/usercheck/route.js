import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb"; 
import Transaction from "../../../../models/Transaction";

export async function POST(req) {
  try {
    const { amount, date, type, note, userId } = await req.json();

    await connectMongoDB(); 

    const newTransaction = await Transaction.create({
      amount,
      date,
      type,
      note,
      userId,
    });

    return NextResponse.json(
      {
        message: "Transaction saved successfully",
        transaction: newTransaction,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving transaction:", error);
    return NextResponse.json(
      { message: "Failed to save transaction", error: error.message },
      { status: 500 }
    );
  }
}
