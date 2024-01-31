import Image from "next/image";
import RadioButton from "./RadioButton";

interface QuestionProps {
  sympCode: string;
  image: string | any;
  question?: string;
  index: number;
}

export default function Question({
  sympCode,
  image,
  question = "Pertanyaan Tidak Diisi",
  index,
}: QuestionProps) {
  return (
    <div className="grid grid-flow-row grid-cols-2 items-center gap-[40px] md:gap-[80px] lg:gap-[50px] py-[56px] lg:py-[86px]">
      {/* image */}
      <div className="col-span-2 md:col-span-1">
        <Image
          src={image}
          className="object-cover md:h-[332px] md:w-[380px] lg:h-[432px] lg:w-[480px] bg-primary rounded-2xl"
          alt=""
          width={480}
          height={432}
          loader={({ src }) => src.toString()}
          unoptimized
        />
      </div>
      {/* info */}
      <div className="col-span-2 md:col-span-1">
        <div className="bg-primary text-sm mb-[10px] p-2 rounded-md">
          Pertanyaan ke {++index}
        </div>
        <h2 className="text-lg font-bold mb-[10px]">
          Apakah pernyataan ini cocok dengan anda?
        </h2>
        <h3 className="mb-4 text-3xl font-bold">{question}</h3>
        <p className="mb-4 text-sm text-red-500">
          *Pilihlah sesuai dengan tingkat keyakinan anda
        </p>
        <RadioButton sympCode={sympCode} />
      </div>
    </div>
  );
}
