"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useAuthStore } from "@/store/authStore"
import { ImagePlus, Lock, Loader2 } from "lucide-react"
import UserAvatar from "./UserAvatar"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/hooks/use-toast"
import apiService from "@/lib/api-service"

// Separate schema for profile and password forms
const profileFormSchema = z.object({
  firstname: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastname: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone_number: z.string().optional(),
  address: z.string().optional(),
})

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, { message: "Current password is required." }),
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Confirm password is required." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function ProfileSettings() {
  const { user, updateUser } = useAuthStore()
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstname: user?.first_name || "",
      lastname: user?.last_name || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      address: user?.address || "",
    },
  })

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Fix the image upload handler to properly handle types
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return // Add null check for user

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    const maxSize = 2 * 1024 * 1024 // 2MB (API limit)

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPEG, PNG, or GIF image.",
        variant: "destructive",
      })
      return
    }

    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Image must be smaller than 2MB.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      const response = await apiService.updateProfileImage(user.id, file)

      if (response && response.data) {
        // Update the user in the store with the new avatar URL
        updateUser({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number,
          address: user.address,
          language: user.language,
          avatar: response.data.avatar,
        })

        toast({
          title: "Profile Image Updated",
          description: "Your profile image has been updated successfully.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Image Update Failed",
        description: error.message || "Unable to update profile image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Fix the profile submit handler to properly handle types
  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>): Promise<void> => {
    if (!user) return // Add null check for user

    try {
      setIsSubmitting(true)

      const profileData = {
        first_name: values.firstname,
        last_name: values.lastname,
        email: values.email,
        phone_number: values.phone_number || "",
        address: values.address || "",
      }

      const response = await apiService.updateProfile(user.id, profileData)

      if (response && response.data) {
        // Update the user in the store
        updateUser({
          id: user.id,
          first_name: values.firstname,
          last_name: values.lastname,
          email: values.email,
          phone_number: values.phone_number || "",
          address: values.address || "",
          language: user.language,
          avatar: user.avatar,
        })

        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Unable to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onPasswordSubmit = async (values: z.infer<typeof passwordFormSchema>): Promise<void> => {
    try {
      // Implement password change logic here
      // This would typically involve calling an API to change the password
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      })

      // Reset password form
      passwordForm.reset()
    } catch (error) {
      toast({
        title: "Password Update Failed",
        description: `Unable to change password. Please try again.`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center justify-center">
              <div className="relative inline-block">
                <UserAvatar size="xlarge" />
                <label
                  htmlFor="profile-image-upload"
                  className={`absolute bottom-0 right-0 p-2 bg-primary text-white shadow rounded-full transition ${
                    isUploading ? "bg-primary/70 cursor-not-allowed" : "hover:bg-primary/80 cursor-pointer"
                  }`}
                  aria-label="Edit profile image"
                >
                  <Input
                    id="profile-image-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    ref={fileInputRef}
                  />
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                </label>
              </div>
            </div>

            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                          disabled
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500">Email address cannot be changed</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-4" /> Reset Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Current password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="New password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

