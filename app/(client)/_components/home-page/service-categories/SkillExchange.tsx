import Image from "next/image";

interface SkillExchangeProps {
  selectedService: any;
  selectedSkill: string;
  onSkillChange: (skill: string) => void;
  users: any[];
}

export default function SkillExchange({
  selectedService,
  selectedSkill,
  onSkillChange,
  users,
}: SkillExchangeProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-10 mb-6">
      <div className="bg-[#F5F5F5] p-4 rounded w-full">
        <p className="text-sm text-gray-400 mb-1">My skill:</p>
        <select
          value={selectedSkill}
          onChange={(e) => onSkillChange(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 text-sm"
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user?.my_service}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center my-4 sm:my-0">
        <Image src="/swapicon.png" alt="Swap Icon" width={100} height={100} />
      </div>

      <div className="bg-[#F5F5F5] p-4 rounded w-full">
        <p className="text-sm text-gray-400 mb-1">Request skill:</p>
        <p className="font-medium">
          {selectedService?.subCategory || "No skill specified"}
        </p>
      </div>
    </div>
  );
}
