import { prisma } from "@/lib/database/prisma";
import { encryptPassword } from "@/lib/helper/password_helper";
import { errorResponse, successResponse } from "@/lib/helper/response_helper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import { ZodError, z } from "zod";

export async function GET() {
  const cashiers = await prisma.cashier.findMany();
  return successResponse(cashiers);
}

const cashierCreateSchema = z.object({
  username: z.string().min(3).max(50),
  full_name: z.string().min(3).max(255),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    let cashierRequest = cashierCreateSchema.parse(body);
    cashierRequest.password = await encryptPassword(cashierRequest.password);
    const cashier = await prisma.cashier.create({
      data: cashierRequest,
    });
    const { password, ...cashierDetail } = cashier;
    return successResponse(cashierDetail);
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
