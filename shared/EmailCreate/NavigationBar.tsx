import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { useCampaignStore } from "@/store/useCampaignStore"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import type { ContactTypes } from "@/types/interface"

interface NavigationBarProps {
  showPreview: boolean
  setShowPreview: (show: boolean) => void
  selectedSenderEmailId: string // Change this line
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  showPreview,
  setShowPreview,
  selectedSenderEmailId,
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)

  const { subject, recipients, selectedTemplateId, isScheduled, scheduledDateTime, resetStore } = useCampaignStore()

  const validateCampaign = () => {
    if (!subject.trim()) {
      toast({
        title: "Missing Subject",
        description: "Please enter a subject for your campaign.",
        variant: "destructive",
      })
      return false
    }

    if (recipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please select at least one recipient for your campaign.",
        variant: "destructive",
      })
      return false
    }

    if (!selectedTemplateId) {
      toast({
        title: "No Template Selected",
        description: "Please select an email template for your campaign.",
        variant: "destructive",
      })
      return false
    }

    if (!selectedSenderEmailId) {
      toast({
        title: "No Sender Email",
        description: "Please select a sender email for your campaign.",
        variant: "destructive",
      })
      return false
    }

    if (isScheduled && !scheduledDateTime) {
      toast({
        title: "Invalid Schedule",
        description: "Please select a valid date and time for your scheduled campaign.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const fetchLatestAudience = async () => {
    try {
      const response = await fetch("/api/user/audience/all")
      if (!response.ok) {
        throw new Error("Failed to fetch audience data")
      }
      const result = await response.json()
      if (result.status !== "success" || !result.data?.contacts) {
        throw new Error("Invalid audience data received")
      }
      return result.data.contacts as ContactTypes[]
    } catch (error) {
      // console.error("Error fetching audience:", error)
      throw error
    }
  }

  const validateRecipients = (contacts: ContactTypes[]) => {
    const contactEmails = new Set(contacts.map((contact) => contact.email.toLowerCase()))
    return recipients.filter((email) => !contactEmails.has(email.toLowerCase()))
  }

  const handleCreateCampaign = async () => {
    if (!validateCampaign()) {
      return
    }

    setIsSending(true)

    try {
      // Fetch fresh audience data
      const latestContacts = await fetchLatestAudience()

      // Validate recipients against fresh contact list
      const invalidRecipients = validateRecipients(latestContacts)

      if (invalidRecipients.length > 0) {
        toast({
          title: "Invalid Recipients",
          description: `The following recipients do not match any contacts in your audience: ${invalidRecipients.join(", ")}`,
          variant: "destructive",
        })
        return
      }

      // Get contact IDs for valid recipients
      const contactIds = latestContacts
        .filter((contact) => recipients.some((email) => email.toLowerCase() === contact.email.toLowerCase()))
        .map((contact) => contact.id)

      const campaignData = {
        title: subject,
        user_email_template_id: selectedTemplateId,
        scheduled_at: isScheduled && scheduledDateTime
          ? scheduledDateTime.toISOString().slice(0, 19).replace('T', ' ')
          : undefined,
        send_now: !isScheduled,
        contacts: contactIds,
        user_sending_email_id: selectedSenderEmailId,
      }

      // console.log("Campaign data being sent:", campaignData) // Log the data being sent

      const response = await fetch("/api/user/campaign/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        // console.error("Error response:", errorData) // Log the error response
        throw new Error(errorData.message || "Failed to create campaign")
      }

      const responseData = await response.json()
      // console.log("API Response:", responseData) // Log the API response

      toast({
        title: "Success",
        description: isScheduled ? "Campaign scheduled successfully!" : "Campaign created and sent successfully!",
      })

      resetStore()
      router.push("/dashboard/campaign/create")
    } catch (error) {
      // console.error("Error creating campaign:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  if (isSending) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
            className="mx-auto w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            aria-label="Loading"
          />
          <p className="mt-4 text-lg font-semibold text-blue-600">
            {isScheduled ? "Scheduling campaign..." : "Sending campaign..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <nav className="border-b bg-white z-50 sticky top-0">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <motion.div
            className="flex items-center gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Link href="/dashboard/campaign">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <span className="text-lg font-semibold text-[#1E0E4E]">Create email</span>
          </motion.div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="sm:flex hidden items-center"
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Preview
                </>
              )}
            </Button>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreateCampaign}>
              <Mail className="h-4 w-4 mr-2" />
              {isScheduled ? "Schedule" : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

