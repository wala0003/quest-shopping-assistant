import { zodResolver } from "@hookform/resolvers/zod"
import type { Provider, User, AuthError } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "~components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~components/ui/form"
import { Input } from "~components/ui/input"
import { Toaster } from "~components/ui/toaster"
import { useToast } from "~components/ui/use-toast"

import "~style.css"

import { supabaseAuto } from "./core/supabase"

// init chrome storage keys
const chromeStorageKeys = {
  supabaseAccessToken: "supabaseAccessToken",
  supabaseRefreshToken: "supabaseRefreshToken",
  supabaseUserData: "supabaseUserData",
  supabaseExpiration: "supabaseExpiration",
  supabaseUserId: "supabaseUserId"
}

// creating a form schema
const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8)
})

interface AuthResponse {
  data?: {
    user?: User
    session?: {
      expires_at: number
    }
  }
  error?: {
    message: string
  }
}

function IndexPopup() {
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [expiration, setExpiration] = useState(0)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values before submitting", values)
    handleLogin(values.username, values.password)
  }

  async function handleLogin(username: string, password: string) {
    try {
      chrome.runtime.sendMessage(
        { action: "signin", value: { email: username, password: password } },
        (response: AuthResponse) => {
          if (response.error) {
            toast({
              description: `Error with auth: ${response.error.message}`
            })
            console.log("Error with auth: " + response.error.message)
          } else if (response.data?.user) {
            setUser(response.data.user)
            setExpiration(response.data.session?.expires_at || 0)
          }
        }
      )
    } catch (error) {
      const authError = error as AuthError
      console.log("Error with auth: " + authError.message)
    }
  }

  async function handleSignup(username: string, password: string) {
    try {
      chrome.runtime.sendMessage(
        { action: "signup", value: { email: username, password: password } },
        (response: AuthResponse) => {
          if (response.error) {
            toast({
              description: `Error with signup: ${response.error.message}`
            })
            console.log("Error with signup: " + response.error.message)
          } else if (response.data?.user) {
            setUser(response.data.user)
            setExpiration(response.data.session?.expires_at || 0)
          }
        }
      )
    } catch (error) {
      const authError = error as AuthError
      console.log("Error with signup: " + authError.message)
      toast({
        description: authError.message
      })
    }
  }

  async function handleSignOut() {
    try {
      chrome.runtime.sendMessage({ action: "signout" }, (response: AuthResponse) => {
        if (response.error) {
          toast({
            description: `Error signing out: ${response.error.message}`
          })
          console.log("Error signing out: ", response.error.message)
        } else {
          setUser(null)
          setExpiration(0)
        }
      })
    } catch (error) {
      const authError = error as AuthError
      console.log("Error signing out: ", authError.message)
    }
  }

  const refreshSession = () => {
    chrome.runtime.sendMessage(
      { action: "refreshsession" },
      (refreshResponse: AuthResponse) => {
        if (refreshResponse.error) {
          console.log("Error refreshing session: " + refreshResponse.error.message)
        } else if (refreshResponse.data?.session) {
          console.log("Session refreshed successfully")
          if (refreshResponse.data.user) {
            setUser(refreshResponse.data.user)
          }
        } else {
          console.log("Error: refreshed session data is not available")
        }
      }
    )
  }

  useEffect(() => {
    chrome.runtime.sendMessage({ action: "getsession" }, (response: AuthResponse) => {
      console.log("response", response)

      if (response.error) {
        if (response.error.message === "Session has expired") {
          console.log("Session has expired, attempting to refresh...")
          refreshSession()
        } else {
          console.log("Error getting session: " + response.error.message)
        }
      } else if (response.data?.session) {
        console.log("Session retrieved successfully")
        console.log("Session data: ", response.data.session)
        if (response.data.user) {
          console.log("User data: ", response.data.user)
          setUser(response.data.user)
        }
      } else {
        console.log("Error: session data is not available")
      }
      setLoadingUser(false)
    })
  }, [])

  if (loadingUser) {
    return (
      <div className="w-96 px-5 py-4">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-96 px-5 py-4">
      <Toaster />
      {user ? (
        <div>
          <h1 className="text-xl font-bold mb-4">User Info</h1>
          <p>User ID: {user.id}</p>
          <Button onClick={handleSignOut} className="mt-4">Sign Out</Button>
        </div>
      ) : (
        <Form {...form}>
          <h1 className="text-xl font-bold mb-4">Quest Shopping Assistant</h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button type="submit">Login</Button>
              <Button 
                type="button"
                onClick={() => {
                  const { username, password } = form.getValues();
                  handleSignup(username, password);
                }}
              >
                Sign Up
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default IndexPopup
