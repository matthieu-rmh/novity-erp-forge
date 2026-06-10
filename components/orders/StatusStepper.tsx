"use client";

import { Fragment } from "react";
import { ORDER_FLOW, ORDER_STATUS } from "@/components/ui/StatusPill";
import type { OrderStatus } from "@/components/ui/StatusPill";
import { CheckIcon } from "@/components/ui/icons";

interface StatusStepperProps {
  status: OrderStatus;
}

export function StatusStepper({ status }: StatusStepperProps) {
  const curIdx = ORDER_FLOW.indexOf(status);

  return (
    <div className="flex items-center flex-1 max-w-xl min-w-[280px]">
      {ORDER_FLOW.map((s: OrderStatus, i: number) => {
        const done = i <= curIdx;
        const meta = ORDER_STATUS[s];
        return (
          <Fragment key={s}>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  done
                    ? "border-transparent text-brand-black"
                    : "border-brand-light-gray text-brand-gray bg-white"
                }`}
                style={
                  done
                    ? {
                        background:
                          meta.dot === "#888888" ? "#E0E0E0" : meta.dot,
                      }
                    : {}
                }
              >
                {done && i < curIdx ? <CheckIcon size={13} /> : i + 1}
              </span>
              <span
                className={`text-[11px] font-bold whitespace-nowrap ${done ? "text-brand-black" : "text-brand-gray"}`}
              >
                {meta.label}
              </span>
            </div>
            {i < ORDER_FLOW.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 -mt-5 min-w-[24px] ${i < curIdx ? "bg-brand-dark-gray" : "bg-brand-light-gray"}`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
