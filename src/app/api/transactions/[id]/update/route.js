import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongoDb"; 
import Transaction from "../../../../models/Transaction";

export async function GET(req, { params }) {
  try {
    await connectMongoDB(); 
    const transaction = await Transaction.findOne({ _id: params.id });

    if (!transaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    console.error("Error retrieving transaction:", error);
    return NextResponse.json(
      { message: "Failed to retrieve transaction", error: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const { amount, date, type, note } = await req.json();

    await connectMongoDB(); 
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, {
      amount: parseFloat(amount), 
      date, 
      type,
      note,
    }, { new: true }); 

    if (!updatedTransaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Transaction updated successfully",
        transaction: updatedTransaction, 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { message: "Failed to update transaction", error: error.message },
      { status: 500 }
    );
  }
}
