import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import EditProfile from "../components/EditProfile"; // 👈 Your form component

const Profile = () => {
  //   const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  return (
    <div className="flex justify-center px-4 py-6">
      <Card className="w-full max-w-2xl dark:bg-gray-800 dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Your Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <img
              src={user?.picture || "/placeholder.jpg"}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border"
            />
          </div>

          <div>
            <p>
              <span className="font-semibold">Name:</span> {user?.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {user?.phoneNumber || "N/A"}
            </p>
          </div>

          <div className="text-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button className="bg-orange-500 text-white">
                  Update Profile
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-[500px] overflow-y-auto"
              >
                <EditProfile closeSheet={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
