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

/**
 * 异步函数：创建发票
 * 
 * 本函数负责根据前端表单提交的数据创建一个新的发票条目。
 * 它首先验证表单数据的有效性，然后将数据插入数据库。如果操作成功，它会刷新相关页面以显示更新后的数据。
 * 
 * @param prevState 应用程序的前一状态，用于比较和更新状态。
 * @param formData 表单数据，包含创建发票所需的信息。
 * @returns 如果验证失败，返回包含错误信息的对象；如果插入数据库失败，返回包含错误消息的对象；否则不返回值。
 */
export async function createInvoice(prevState: State, formData: FormData) {
  // 使用 Zod 库验证表单数据的结构和类型
  // 使用 Zod 验证表单字段
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // 如果表单数据验证失败，则返回错误信息
  // 如果表单验证失败，则尽早返回错误。否则，继续。
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '缺少字段。创建发票失败。',
    };
  }

  // 提取验证后的数据，并计算金额的 cents 值
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    // 将发票数据插入数据库
    await sql`INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
  } catch (error) {
    // 如果数据库操作失败，则返回错误信息
    return {
      message: '数据库错误：无法创建发票。',
    };
  }

  // 刷新相关页面以显示新创建的发票
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

/**
 * 异步函数：尝试使用表单数据进行用户认证。
 * 
 * @param prevState - 上一次的认证状态，可能是字符串或未定义。
 * @param formData - 包含认证所需信息的表单数据。
 * @returns 当认证失败时，返回错误消息字符串；否则，不返回值。
 */
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // 尝试使用提供的表单数据进行登录。
    await signIn('credentials', formData);
  } catch (error) {
    // 如果错误是AuthError类型的实例，进行特定处理。
    if (error instanceof AuthError) {
      switch (error.type) {
        // 针对特定的认证错误类型返回相应的错误消息。
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    // 如果错误不是AuthError类型，重新抛出错误。
    throw error;
  }
}
