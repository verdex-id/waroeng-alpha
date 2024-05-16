import { prisma } from "@/lib/database/prisma";
import { errorResponse, successResponse } from "@/lib/helper/response_helper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import { ZodError, z } from "zod";

type Params = {
  params: {
    code: string;
  };
};

export async function GET(request: NextRequest, { params }: Params) {
  const products = await prisma.product.findFirst({
    where: {
      code: params.code,
    },
  });

  if (products) {
    return successResponse(products);
  } else {
    return errorResponse(
      404,
      "NotFound",
      `product with code: ${params.code} not found`
    );
  }
}

const productUpdateSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  stock: z.number().min(0).optional(),
  price: z.number().min(100).optional(),
  supplier_price: z.number().min(100).optional(),
});

export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json();

  try {
    const productRequest = productUpdateSchema.parse(body);
    const product = await prisma.product.update({
      data: productRequest,
      where: {
        code: params.code,
      },
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

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const product = await prisma.product.delete({
      where: {
        code: params.code,
      },
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
