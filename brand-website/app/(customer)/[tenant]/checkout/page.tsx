"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, CreditCard, Banknote, ChevronLeft, ChevronRight, Smartphone, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { useTenant } from "@/lib/hooks/use-tenant";
import { useCreateOrder } from "@/lib/hooks/use-orders";
import { useAuthStore } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { formatCurrency, cn } from "@/lib/utils";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/config";

const schema = z.object({
  name:          z.string().min(2, "Name is required"),
  phone:         z.string().min(10, "Valid phone required"),
  street:        z.string().min(5, "Address is required"),
  city:          z.string().min(2, "City is required"),
  notes:         z.string().optional(),
  paymentMethod: z.enum(["CASH", "CARD", "ONLINE"]),
});

type FormValues = z.infer<typeof schema>;

const STEPS = ["Delivery", "Payment", "Confirm"] as const;

const PAYMENT_OPTIONS = [
  { value: "CASH",   label: "Cash on Delivery",   sub: "Pay when your order arrives",    icon: Banknote,    color: "text-green-600",  bg: "bg-green-50"  },
  { value: "CARD",   label: "Card on Delivery",    sub: "Swipe on delivery",              icon: CreditCard,  color: "text-blue-600",   bg: "bg-blue-50"   },
  { value: "ONLINE", label: "Online Payment",      sub: "JazzCash / EasyPaisa / Stripe",  icon: Smartphone,  color: "text-purple-600", bg: "bg-purple-50" },
] as const;

export default function CheckoutPage() {
  const router  = useRouter();
  const { data: tenant } = useTenant();
  const { user } = useAuthStore();
  const cart     = useCartStore((s) => s.cart);
  const sub      = useCartStore((s) => s.subtotal)();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const [step, setStep] = useState(0);

  const deliveryFee = sub >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = sub + deliveryFee;
  const totalItems = cart?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;

  const { register, handleSubmit, watch, trigger, getValues, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:          user?.name ?? "",
      phone:         user?.phone ?? "",
      paymentMethod: "CASH",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const goNext = async () => {
    const valid = await trigger(step === 0 ? ["name","phone","street","city"] : ["paymentMethod"]);
    if (valid) setStep((s) => Math.min(s + 1, 2));
  };

  const onSubmit = async (values: FormValues) => {
    if (!cart || !tenant) return;
    const order = await createOrder({
      tenantId: tenant.id,
      branchId: cart.branchId,
      items: cart.items.map((i) => ({
        menuItemId:          i.menuItem.id,
        quantity:            i.quantity,
        variantOptionIds:    Object.values(i.selectedVariants).map((v) => v.id),
        addonOptionIds:      i.selectedAddons.map((a) => a.id),
        specialInstructions: i.specialInstructions,
      })),
      deliveryAddress: { street: values.street, city: values.city, notes: values.notes },
      paymentMethod:   values.paymentMethod,
    });
    router.push(`/${tenant.slug}/order-success/${order.id}`);
  };

  if (!cart?.items.length) {
    router.replace(`/${tenant?.slug}/cart`);
    return null;
  }

  const formValues = getValues();

  return (
    <div className="pb-10">
      {/* Progress header */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-3">
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : router.back()}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  i < step  && "gradient-brand text-white",
                  i === step && "bg-brand-500 text-white ring-2 ring-brand-200",
                  i > step  && "bg-gray-100 text-gray-400"
                )}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={cn(
                  "text-xs font-medium hidden sm:block transition-colors",
                  i === step ? "text-brand-600" : i < step ? "text-gray-600" : "text-gray-400"
                )}>
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 rounded-full transition-colors",
                    i < step ? "bg-brand-500" : "bg-gray-100"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        {/* ── Desktop 2-column layout ── */}
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 lg:items-start">

          {/* ── LEFT: Form steps ── */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">

              {/* Step 0: Delivery */}
              {step === 0 && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="space-y-4"
                >
                  <h2 className="font-bold text-xl font-heading">Delivery Details</h2>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 space-y-4">
                    <p className="text-sm font-bold text-gray-700">Contact</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Input label="Full name" placeholder="Ali Haider" {...register("name")} error={errors.name?.message} />
                      <Input label="Phone" type="tel" placeholder="+92 300 1234567" {...register("phone")} error={errors.phone?.message} />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 space-y-4">
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <MapPin size={15} className="text-brand-500" /> Delivery Address
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Input label="Street / House No." placeholder="26-Y DHA Phase 5" {...register("street")} error={errors.street?.message} />
                      <Input label="City" placeholder="Lahore" {...register("city")} error={errors.city?.message} />
                    </div>
                    <Textarea label="Delivery notes (optional)" placeholder="Landmark, gate no., floor..." {...register("notes")} />
                  </div>

                  <Button type="button" fullWidth size="lg" onClick={goNext} className="shadow-brand">
                    Continue to Payment <ChevronRight size={18} />
                  </Button>
                </motion.div>
              )}

              {/* Step 1: Payment */}
              {step === 1 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="space-y-4"
                >
                  <h2 className="font-bold text-xl font-heading">Payment Method</h2>

                  <div className="space-y-3">
                    {PAYMENT_OPTIONS.map(({ value, label, sub: subtitle, icon: Icon, color, bg }) => (
                      <label
                        key={value}
                        className={cn(
                          "flex items-center gap-4 p-4 lg:p-5 rounded-2xl border-2 cursor-pointer transition-all",
                          paymentMethod === value
                            ? "border-brand-500 bg-brand-50 shadow-brand"
                            : "border-gray-100 bg-white hover:border-gray-200"
                        )}
                      >
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", bg)}>
                          <Icon size={22} className={color} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
                        </div>
                        {paymentMethod === value ? (
                          <CheckCircle2 size={20} className="text-brand-500 shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0" />
                        )}
                        <input type="radio" value={value} {...register("paymentMethod")} className="sr-only" />
                      </label>
                    ))}
                  </div>

                  <Button type="button" fullWidth size="lg" onClick={goNext} className="shadow-brand">
                    Review Order <ChevronRight size={18} />
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Confirm */}
              {step === 2 && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="space-y-4"
                >
                  <h2 className="font-bold text-xl font-heading">Review & Confirm</h2>

                  {/* Delivery details recap */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-gray-700">Delivery to</p>
                      <button type="button" onClick={() => setStep(0)} className="text-xs text-brand-500 font-semibold hover:text-brand-700">
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{formValues.name}</p>
                    <p className="text-sm text-gray-500">{formValues.phone}</p>
                    <p className="text-sm text-gray-500 mt-1">{formValues.street}, {formValues.city}</p>
                    {formValues.notes && <p className="text-xs text-gray-400 italic mt-1">Note: {formValues.notes}</p>}
                  </div>

                  {/* Payment recap */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const opt = PAYMENT_OPTIONS.find((p) => p.value === paymentMethod);
                        if (!opt) return null;
                        const Icon = opt.icon;
                        return (
                          <>
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", opt.bg)}>
                              <Icon size={18} className={opt.color} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{opt.label}</p>
                              <p className="text-xs text-gray-400">{opt.sub}</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    <button type="button" onClick={() => setStep(1)} className="text-xs text-brand-500 font-semibold hover:text-brand-700">
                      Edit
                    </button>
                  </div>

                  {/* Items recap */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                    <p className="text-sm font-bold text-gray-700 mb-3">Order Items</p>
                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.menuItem.imageUrl ? (
                            <Image
                              src={item.menuItem.imageUrl}
                              alt={item.menuItem.name}
                              width={44}
                              height={44}
                              className="w-11 h-11 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">🍔</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.menuItem.name}</p>
                            <p className="text-xs text-gray-400">×{item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-gray-700 shrink-0">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" fullWidth size="lg" loading={isPending} className="shadow-brand">
                    Place Order — {formatCurrency(total)}
                  </Button>
                  <p className="text-xs text-center text-gray-400">
                    By placing this order you agree to our Terms & Conditions
                  </p>
                </motion.div>
              )}

            </AnimatePresence>
          </form>

          {/* ── RIGHT: Sticky order summary ── */}
          <div className="hidden lg:block mt-0 sticky top-28">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="font-bold text-base font-heading">Order Summary</h3>
                <p className="text-xs text-gray-400 mt-0.5">{totalItems} item{totalItems !== 1 && "s"}</p>
              </div>

              {/* Items */}
              <div className="px-5 py-4 max-h-72 overflow-y-auto space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.menuItem.imageUrl ? (
                      <Image
                        src={item.menuItem.imageUrl}
                        alt={item.menuItem.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-base shrink-0">🍔</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.menuItem.name}</p>
                      <p className="text-[10px] text-gray-400">×{item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-700 shrink-0">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bill */}
              <div className="px-5 py-4 border-t border-gray-50 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-700">{formatCurrency(sub)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    <span className="font-medium text-gray-700">{formatCurrency(deliveryFee)}</span>
                  )}
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-brand-600 text-lg">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Selected payment (shown after step 1) */}
              {step >= 1 && (
                <div className="px-5 pb-4">
                  <div className="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
                    {(() => {
                      const opt = PAYMENT_OPTIONS.find((p) => p.value === paymentMethod);
                      if (!opt) return null;
                      const Icon = opt.icon;
                      return (
                        <>
                          <Icon size={14} className={opt.color} />
                          <span className="text-xs font-medium text-gray-600">{opt.label}</span>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
