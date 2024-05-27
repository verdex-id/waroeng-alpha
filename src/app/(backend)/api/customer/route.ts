import { prisma } from "@/lib/database/prisma";
import { encryptPassword } from "@/lib/helper/password_helper";
import { errorResponse, successResponse } from "@/lib/helper/response_helper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import { ZodError, z } from "zod";

export async function GET() {
  const customers = await prisma.customer.findMany();
  return successResponse(customers);
}

const customerCreateSchema = z.object({
  username: z.string().min(3).max(50),
  full_name: z.string().min(3).max(255),
  description: z.string().min(3).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    let customerRequest = customerCreateSchema.parse(body);
    const customer = await prisma.customer.create({
      data: customerRequest,
    });
    return successResponse(customer);
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
