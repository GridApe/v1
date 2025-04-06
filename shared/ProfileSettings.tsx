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
import axios from "axios"
// import apiService from "@/lib/api-service"

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
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
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
    if (!file || !user) return
  
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    const maxSize = 2 * 1024 * 1024
  
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
  
      const formData = new FormData()
      formData.append("avatar", file)
  
      const response = await axios.post(`/api/user/profile/avatar/`, formData, {
        headers: {
          Accept: "application/json",
        },
      })
  
      if (response && response.data) {
        // Create a complete user object with all required fields
        const updatedUser = {
          ...user,
          avatar: response.data.data.avatar_url,
        }        
        // Update the user in the store
        updateUser(updatedUser)
  
        toast({
          title: "Profile Image Updated",
          description: "Your profile image has been updated successfully.",
        })
      }
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Image Update Failed",
        description:
          error.response?.data?.error || error.message || "Unable to update profile image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
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
      const res = await axios.put(`/api/user/profile/update/`, {
        first_name: values.firstname,
        last_name: values.lastname,
        email: values.email,
        phone_number: values.phone_number || "",
        address: values.address || "",
      })
      if (!res.data) {
        throw new Error("No data returned from the server")
        toast({
          title: "Update Failed",
          description: "Unable to update profile. Please try again.",
          variant: "destructive",
        })
      }
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
    } catch (error) {
      toast({
        title: "Update Failed",
        description: `${error} || "Unable to update profile. Please try again."`,
        variant: "destructive",
      })
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onPasswordSubmit = async (values: z.infer<typeof passwordFormSchema>): Promise<void> => {
    if (!user) return

    try {
      setIsPasswordSubmitting(true)

      const response = await axios.post("/api/user/profile/update-password", {
        old_password: values.currentPassword,
        new_password: values.newPassword,
        new_password_confirmation: values.confirmPassword, // Add confirmation field
      })

      if (response.data.status === false) {
        throw new Error(response.data.message || "Password reset failed")
      }

      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      })

      // Reset password form
      passwordForm.reset()
    } catch (error: any) {
      console.error("Password reset error:", error)

      // Handle validation errors specifically
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(". ")

        toast({
          title: "Password Update Failed",
          description: errorMessages || "Validation failed. Please check your input.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Password Update Failed",
          description: error.response?.data?.message || error.message || "Unable to change password. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsPasswordSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Profile Information</CardTitle>
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
                <Button type="submit" className="w-full" disabled={isPasswordSubmitting}>
                  {isPasswordSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

