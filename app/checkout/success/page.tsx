import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-2xl font-semibold text-[#3a3f55]">Спасибо за заказ</h1>
      <p className="text-[#676682] max-w-md">
        Оплата прошла успешно. Мы свяжемся с вами для уточнения деталей доставки.
      </p>
      <Link
        href="/"
        className="rounded-full bg-[#5078DF] text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity"
      >
        На главную
      </Link>
    </div>
  );
}
