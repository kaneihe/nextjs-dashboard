'use client'

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice } from '@/app/lib/actions';
import { useFormState } from 'react-dom';


export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState = {message: null, errors: {}}
  // [state, dispatch]- 表单状态和调度函数(执行插入操作)
  const [state, dispatch] = useFormState(createInvoice, initialState)
  console.log('dispatch = ', dispatch)
  // React Server Actions 允许您在服务器上直接运行异步代码。它们消除了通过创建 API 改变数据的方式
  // 在 React 中，action 属性被视为一个特殊的 prop - 这意味着 React 在其之上构建，以允许调用 actions。
  // 在幕后，Server Actions 创建一个 POST API 端点。这就是在使用 Server Actions 时为什么不需要手动创建 API 端点的原因。
  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            选择客户(Choose customer)
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby='customer-error'
              // required
            >
              <option value="" disabled>
                选择一个客户
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
                {state.errors?.customerId && 
                  state.errors.customerId.map((error: string) => (
                    <p className='mt-2 text-sm text-red-500' key={error}>
                      {error}
                    </p>
                  ))}
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
          选择金额(Choose an amount)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='amount-error'
                // required
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              <div id="amount-error" aria-live="polite" aria-atomic="true">
                {state.errors?.amount && 
                  state.errors.amount.map((error: string) => (
                    <p className='mt-2 text-sm text-red-500' key={error}>
                      {error}
                    </p>
                  ))}
          </div>
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            设置发票状态(Set the invoice status)
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby='status-error'
                  // required
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  待付款(Pending) <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  已付(Paid) <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
                {state.errors?.status && 
                  state.errors.status.map((error: string) => (
                    <p className='mt-2 text-sm text-red-500' key={error}>
                      {error}
                    </p>
                  ))}
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          删除
        </Link>
        <Button type="submit">创建发票</Button>
      </div>
    </form>
  );
}
