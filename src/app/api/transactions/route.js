import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb"; 
import Transaction from "../../../../models/Transaction";

export async function POST(req) {
  try {
    const { amount, date, type, note, userId } = await req.json();

    await connectMongoDB();

    
    const parsedAmount = parseFloat(amount);

   
    if (isNaN(parsedAmount)) {
        return NextResponse.json(
            { message: "Invalid amount" },
            { status: 400 }
        );
    }

    const newTransaction = new Transaction({
      amount: parsedAmount, 
      date: new Date(date), 
      type,
      note,
      userId,
    });

    await newTransaction.save(); 

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
