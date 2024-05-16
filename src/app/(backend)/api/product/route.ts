import { prisma } from "@/lib/database/prisma";
import { errorResponse, successResponse } from "@/lib/helper/response_helper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import { ZodError, z } from "zod";

export async function GET() {
  const products = await prisma.product.findMany();
  return successResponse(products);
}

const productCreateSchema = z.object({
  code: z.string().min(3).max(50),
  name: z.string().min(3).max(255),
  stock: z.number().min(0),
  price: z.number().min(100),
  supplier_price: z.number().min(100),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const productRequest = productCreateSchema.parse(body);
    const product = await prisma.product.create({
      data: productRequest,
    });
    return successResponse(product);
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
