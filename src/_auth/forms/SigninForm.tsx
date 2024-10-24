import { Button } from "@/components/ui/button"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignInValidation } from "@/lib/validation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Loader from "@/components/shared/Loader"
import { useToast } from "@/hooks/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutation"
import { useUserContext } from "@/context/AuthContext"



const SigninForm = () => {
  const navigate = useNavigate();
  const {toast} = useToast(); 
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();

  const {mutateAsync: signInAccount} = useSignInAccount()
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    const session = await signInAccount({email: values.email, password: values.password});   

    if(!session) {
      toast({title: "Sign in failed", description: "Please try again", variant: "destructive"});
      return;
    }

    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn){
      form.reset();
      toast({title: "Account logged in successfully", description: "Welcome back!", variant: "default"})
      navigate('/');
    }else{
      toast({title: "Sign in failed", description: "Please try again", variant: "destructive"});
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" width={150} height={36} />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">To use Pixify, please enter your details</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4 md:mt-8">
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
          <Button className="shad-button_primary" type="submit" disabled={isUserLoading}>
            {isUserLoading ? <div className="flex-center gap-2"><Loader/> Loading...</div> : "Sign in"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link to="/sign-up">
              <span className="text-primary-500 text-small-semibold ml-1">Sign up</span>
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm
