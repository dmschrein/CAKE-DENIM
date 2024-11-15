"use client";

import { z } from "zod";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { User } from "@/interfaces";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  phone: z.string().min(10, {
    message: "Please provide a valid phone number.",
  }),
  gender: z.string().optional(),
});

type ProfileProps = {
  userDetails: User | null;
};

{
  /* Name, phone, gender, birthday, preferred size info form */
}
const Profile: React.FC<ProfileProps> = ({ userDetails }) => {
  // get the user details here to pre-populate the form?
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: userDetails?.firstName || "",
      lastName: userDetails?.lastName || "",
      phone: userDetails?.phone || "",
      gender: userDetails?.gender || "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("{Form data submitted: ", data);
  };

  return (
    <div>
      <h2>Profile</h2>

      <Form>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                {errors.firstName && (
                  <FormMessage>{errors.firstName.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                {errors.lastName && (
                  <FormMessage>{errors.lastName.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone Number" {...field} />
                </FormControl>
                {errors.phone && (
                  <FormMessage>{errors.phone.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Input placeholder="Gender" {...field} />
                </FormControl>
                {errors.gender && (
                  <FormMessage>{errors.gender.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <div className="flex flex-row">
            <Button type="reset">Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
