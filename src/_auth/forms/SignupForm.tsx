import { Button } from "@/components/ui/button"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignUpValidation } from "@/lib/validation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Loader from "@/components/shared/Loader"
import { useToast } from "@/hooks/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutation"
import { useUserContext } from "@/context/AuthContext"



const SignupForm = () => {
  const navigate = useNavigate();
  const {toast} = useToast(); 
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();

  const {mutateAsync: createUserAccount , isPending: isCreatingUser} = useCreateUserAccount()

  const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount()
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    const newUser = await createUserAccount(values);
    console.log("New user created:", newUser)
    if(!newUser) {
      toast({title: "Sign up failed", description: "Please try again", variant: "destructive"})
      return;
    }
    
    const session = await signInAccount({email: values.email, password: values.password});   

    if(!session) {
      toast({title: "Sign in failed", description: "Please try again", variant: "destructive"});
      return;
    }

    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn){
      form.reset();
      toast({title: "Account created successfully", description: "Please check your email for verification", variant: "default"})
      navigate('/');
    }else{
      toast({title: "Sign up failed", description: "Please try again", variant: "destructive"});
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col max-h-screen">
        <div className="flex-center flex-col gap-2 mb-4">
          <img src="/assets/images/logo.svg" alt="logo" width={150} height={30} />
          <h2 className="h3-bold md:h2-bold">Create your account</h2>
          {/* <p className="text-light-3 small-medium md:base-regular text-center">To use Pixify, please enter your details</p> */}
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full mt-4">
          <FormField
            control={form.control}
            name="name" 
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
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
                  <Input type="email" className="shad-input" {...field} />
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
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary mt-2" type="submit" disabled={isCreatingUser}>
            {isCreatingUser ? <div className="flex-center gap-2"><Loader/> Loading...</div> : "Sign up"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to="/sign-in">
              <span className="text-primary-500 text-small-semibold ml-1">Log in</span>
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm
