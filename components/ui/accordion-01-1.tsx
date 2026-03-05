import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export type Accordion01Item = {
  id: string
  title: string
  content: string
}

type Accordion01Props = {
  items: Accordion01Item[]
  defaultValue?: string
  className?: string
}

export function Accordion01({ items, defaultValue, className }: Accordion01Props) {
  return (
    <div className={cn("mx-auto w-full", className)}>
      <Accordion
        type="single"
        defaultValue={defaultValue ?? items[0]?.id}
        collapsible
        className="w-full"
      >
        {items.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className="border-[var(--alt-grey)]"
          >
            <AccordionTrigger className="group cursor-pointer text-left transition-all duration-500 hover:pl-2 hover:no-underline [&>svg]:hidden">
              <div className="flex flex-1 items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-[var(--silver)]">{item.id}</p>
                  <h3 className="text-lg font-semibold text-[var(--main-black)] md:text-xl">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center rounded-sm bg-[var(--main-black)] p-2 transition-colors duration-300 group-hover:bg-[var(--text-grey)]">
                  <Plus
                    className={cn(
                      "size-4 shrink-0 text-[var(--text-white)] transition-transform duration-500 group-data-[state=open]:rotate-90",
                    )}
                  />
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-6 pr-3 text-[var(--text-grey)] md:pr-20 whitespace-pre-line">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
