import { uncertaintyValueRawData } from "@/prisma/data";
import { useState } from "react";

interface Option {
  label: string;
  value: number;
}

interface RadioButtonProps {
  sympCode: string;
}

const optionDescendSort: Option[] = [...uncertaintyValueRawData].sort((a, b) => b.value - a.value);
const options: Option[] = optionDescendSort

export default function RadioButton({ sympCode }: RadioButtonProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(() => {
    const findZero = options.find((option) => option.value === 0);
    return findZero?.label;
  });

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleButtonClick = (option: string) => {
    handleOptionChange(option);
  };

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, option: string) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      handleButtonClick(option);
    }
  };

  return (
    <div className="grid grid-flow-row grid-cols-3 gap-4">
      {options.map((option: Option, index: number) => (
        <button
          key={index}
          tabIndex={0}
          className={`RadioButton ${selectedOption === option.label
            ? "btn-primary"
            : "btn-outline btn-primary"
            } btn col-span-1 text-xs text-center rounded-lg p-2`}
          aria-pressed={selectedOption === option.label}
          role="button"
          onKeyDown={(event) => handleButtonKeyDown(event, option.label)}
          onClick={() => handleButtonClick(option.label)}
          type="button"
        >
          <input
            type="radio"
            className="hidden"
            name={sympCode}
            value={option.value}
            checked={selectedOption === option.label}
            onChange={() => handleOptionChange(option.label)}
          />
          {option.label}
        </button>
      ))}
    </div>
  );
}
