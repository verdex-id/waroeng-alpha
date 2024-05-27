import { prisma } from "@/lib/database/prisma";
import { errorResponse, successResponse } from "@/lib/helper/response_helper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import { ZodError, z } from "zod";

export async function GET() {
  const transactions = await prisma.transaction.findMany();
  return successResponse(transactions);
}

const transactionCreateSchema = z.object({
  cashier_username: z.string().min(3).max(50),
  customer_username: z.string().min(3).max(50).optional(),
  payment_method: z.string().min(3),
  total_price: z.number().min(100),
  transaction_items: z
    .object({
      product_code: z.string().min(3),
      quantity: z.number().min(1),
    })
    .array()
    .min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const transactionRequest = transactionCreateSchema.parse(body);
    const { transaction_items, ...transactionOnlyRequest } = transactionRequest;
    let transaction;
    if (transactionRequest.customer_username) {
      transaction = await prisma.transaction.create({
        data: {
          ...transactionOnlyRequest,
          TransactionItem: {
            createMany: {
              data: transaction_items,
            },
          },
        },
      });
    } else {
      transaction = await prisma.transaction.create({
        data: {
          ...transactionOnlyRequest,
          TransactionItem: {
            createMany: {
              data: transaction_items,
            },
          },
        },
      });
    }
    return successResponse(transaction);
  } catch (err: any) {
    if (err instanceof ZodError) {
      return errorResponse(409, err.name, err.errors);
    } else if (err instanceof PrismaClientKnownRequestError) {
      return errorResponse(400, err.name, err.message);
    } else {
      return errorResponse(500, "UnknownError", null);
    }
  }
}
