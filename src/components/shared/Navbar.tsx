import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText } from "lucide-react";

const currentUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
};

const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Note Mesh</h1>
        </div>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={currentUser.avatar || "/placeholder.svg"}
              alt={currentUser.name}
            />
            <AvatarFallback>
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-700">
            {currentUser.name}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
