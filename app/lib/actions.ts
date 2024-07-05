'use server';

import { signIn } from '@/auth';
import {sql} from './sql-hack'
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: '请选择一位客户。' }),
  amount: z.coerce.number().gt(0, { message: '请输入大于 0 美元的金额。' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: '请选择发票状态。',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // 使用 Zod 验证表单字段
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // Test it out
  // console.log(customerId)
  console.log(validatedFields);

  // 如果表单验证失败，则尽早返回错误。否则，继续。
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '缺少字段。创建发票失败。',
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
  } catch (error) {
    return {
      message: '数据库错误：无法创建发票。',
    };
  }

  // 由于您要更新发票路由中显示的数据，因此您希望清除此缓存并向服务器触发新请求。
  // 您可以使用revalidatePath Next.js 中的函数来执行此操作
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// 编辑更新发票
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: '数据库错误：无法更新发票。',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// 删除发票
export async function deleteInvoice(id: string) {
  // throw new Error('删除发票失败');
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return {
      message: '数据库错误：无法删除发票。',
    };
  }

  revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
