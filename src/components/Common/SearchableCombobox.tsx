import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormControl, FormItem } from "@/components/ui/form";
import { RequiredLabel } from "./RequiredLabel";

interface SearchableComboboxProps<T extends { [key: string]: any }> {
  label: string;
  placeholder: string;
  options: T[];
  value: string;
  onChange: (value: string) => void;
  displayKey: keyof T;
  valueKey: keyof T;
  disabled?: boolean;
}

const SearchableCombobox = <T extends { [key: string]: any }>({
  label,
  placeholder,
  options,
  value,
  onChange,
  displayKey,
  valueKey,
  disabled,
}: SearchableComboboxProps<T>) => {
  const [open, setOpen] = useState(false);

  const selectedOption = Array.isArray(options)
    ? options.find((option) => option[valueKey] === value)
    : undefined;

  const displayValue = selectedOption
    ? (selectedOption[displayKey] as string)
    : placeholder;

  return (
    <FormItem>
      <RequiredLabel>{label}</RequiredLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between overflow-hidden text-ellipsis whitespace-nowrap",
                !value && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              {displayValue}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0">
          <Command>
            <CommandInput placeholder={`Buscar ${label.toLowerCase()}...`} />
            <CommandEmpty>No se encontró {label.toLowerCase()}</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {Array.isArray(options) &&
                options.map((option) => (
                  <CommandItem
                    key={option[valueKey] as string}
                    value={option[displayKey] as string}
                    onSelect={(currentValue) => {
                      const selectedItem = options.find(
                        (item) =>
                          (item[displayKey] as string).toLowerCase() ===
                          currentValue
                      );

                      const selectedItemValue = selectedItem?.[
                        valueKey
                      ] as string;

                      onChange(
                        selectedItemValue === value ? "" : selectedItemValue
                      );

                      //   onChange(
                      //     selectedItem?.[valueKey] === value
                      //       ? ""
                      //       : (selectedItem?.[valueKey] as string) || ""
                      //   );
                      setOpen(false);
                    }}
                    className="cursor-pointer px-3 py-2 text-sm transition-colors duration-150 ease-in-out
                      hover:bg-blue-100 dark:hover:bg-blue-900
                      data-[state=checked]:bg-blue-50 dark:data-[state=checked]:bg-blue-950
                      data-[state=checked]:font-semibold data-[state=checked]:text-blue-600 dark:data-[state=checked]:text-blue-300"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option[valueKey] ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option[displayKey] as string}
                  </CommandItem>
                ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
};

export default SearchableCombobox;
