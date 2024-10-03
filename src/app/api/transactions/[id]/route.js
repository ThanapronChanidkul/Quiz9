import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongoDb"; 
import Transaction from "../../../models/Transaction";


export async function GET(req, { params }) {
  const { id } = params;
  
  try {
    await connectMongoDB(); 
    const transactions = await Transaction.find({ userId: id });

    
    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ message: "No transactions found for this user" }, { status: 404 });
    }

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return NextResponse.json(
      { message: "Failed to retrieve transactions", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectMongoDB();
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

   
    if (!deletedTransaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { message: "Failed to delete transaction", error: error.message },
      { status: 500 }
    );
  }
}
