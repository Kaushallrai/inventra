"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateSupplierMutation } from "@/redux/apiSlice";
import { BaseModal } from ".";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  contact: z
    .string()
    .min(2, { message: "Contact must be at least 2 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" })
    .optional()
    .or(z.literal("")),
});

interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string | null;
  address: string | null;
}

interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export function EditSupplierModal({
  isOpen,
  onClose,
  supplier,
}: EditSupplierModalProps) {
  const [updateSupplier, { isLoading: isUpdating }] =
    useUpdateSupplierMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      email: "",
      address: "",
    },
  });

  useEffect(() => {
    if (supplier && isOpen) {
      form.reset({
        name: supplier.name,
        contact: supplier.contact,
        email: supplier.email || "",
        address: supplier.address || "",
      });
    }
  }, [supplier, isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!supplier) return;

    try {
      const result = await updateSupplier({
        id: supplier.id,
        ...values,
        email: values.email || null,
        address: values.address || null,
      }).unwrap();
      console.log("Update result:", result);
      toast.success("Supplier updated successfully");
      onClose();
    } catch (error) {
      console.error("Failed to update supplier:", error);
      toast.error("Failed to update supplier");
    }
  }

  if (!supplier) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Supplier"
      description="Edit supplier details"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter supplier name"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter supplier contact"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter supplier email"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter supplier address"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Supplier"}
            </Button>
          </div>
        </form>
      </Form>
    </BaseModal>
  );
}
