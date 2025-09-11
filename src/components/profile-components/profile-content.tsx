import { Key, Trash2 } from "lucide-react";

import { Button } from "@/components/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Separator } from "@/components/shadcn/ui/separator";
import { Switch } from "@/components/shadcn/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { Badge } from "@/components/shadcn/ui/badge";
import { authClient } from "@/lib/auth-client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { User, UserForm, userFormSchema, PasswordChangeForm, passwordChangeSchema } from "drizzle/db/schema";
import { updateUserData } from "@/utils/user";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../shadcn/ui/dialog";
import React from "react";

export default function ProfileContent() {
  const { data: session } = authClient.useSession();
  const currentUser = session?.user as User;
  const navigate = useNavigate();
  
  const [switchState, setSwitchState] = React.useState(currentUser?.role === "artist");

  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      id: currentUser?.id ?? "",
      name: currentUser?.name ?? "",
      phone: currentUser?.phone ?? "",
      location: currentUser?.location ?? "",
      bio: currentUser?.bio ?? "",
      role: currentUser?.role === "artist" ? "artist" : "user",
    },
  });

  const onSubmit = async (data: UserForm) => {
    console.log("Submitting data:", data);
    try {
      await updateUserData({ data });
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user!");
    }
  };

  const passwordForm = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordchange = async (data: PasswordChangeForm) => {
    try {
      const { error } = await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Password changed successfully!");
      passwordForm.reset();
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password!");
    }
  };

  const handleRoleToggle = async (checked: boolean): Promise<void> => {
    setSwitchState(checked);

    const newRole: "artist" | "user" = checked ? "artist" : "user";
    
    try {
      const updatedUserData: UserForm = {
        id: currentUser?.id ?? "",
        name: currentUser?.name ?? "",
        phone: currentUser?.phone ?? "",
        location: currentUser?.location ?? "",
        bio: currentUser?.bio ?? "",
        role: newRole
      };

      await updateUserData({ data: updatedUserData });
      toast.success(`User role updated to ${newRole}!`);
    } catch (error) {
      console.error(`Failed to update user role to ${newRole}:`, error);
      toast.error(`Failed to update user role to ${newRole}!`);
      setSwitchState(!checked);
    }
  };

  return (
    <Tabs defaultValue="personal" className="space-y-6 mt-8">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      {/* Personal Information */}
      <TabsContent value="personal" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and profile information.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form id="user-form" method="post" onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="Ludwig Skoeld"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="ludwig.skoeld@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="phone" >
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="phone"
                            placeholder="+46 (070) 123-456"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="location" >
                          Location
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="location"
                            placeholder="Varberg, Halland"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="bio" >
                          Bio
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            id="bio"
                            placeholder="Tell us about yourself..."
                            rows={4}
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button form="user-form" type="submit" disabled={!form.formState.isDirty || !form.formState.isValid} onClick={form.handleSubmit(onSubmit)}>Save Changes</Button>
                </div>
              </CardContent>
            </form>
          </Form>
        </Card>
      </TabsContent>

      {/* Account Settings */}
      <TabsContent value="account" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences and subscription.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Account Status</Label>
                <p className="text-muted-foreground text-sm">Your account is currently active</p>
              </div>
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                Active
              </Badge>
            </div>
            {/* <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Subscription Plan</Label>
                <p className="text-muted-foreground text-sm">Pro Plan - $29/month</p>
              </div>
              <Button variant="outline">Manage Subscription</Button>
            </div>
            <Separator /> */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Switch role</Label>
                <p className="text-muted-foreground text-sm">
                  Switch betweeen being an Artist or a regular User. Only Artists are able to create events. Default is User.
                </p>
              </div>
              <Switch onCheckedChange={handleRoleToggle} checked={switchState} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Data Export</Label>
                <p className="text-muted-foreground text-sm">Download a copy of your data</p>
              </div>
              <Button variant="outline">Export Data</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Delete Account</Label>
                <p className="text-muted-foreground text-sm">
                  Permanently delete your account and all data
                </p>
              </div>
              <Dialog>
                <DialogTrigger>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you Sure?</DialogTitle>
                    <DialogDescription>Your account will be permanently deleted, this action cannot be undone.</DialogDescription>
                    <Button variant="destructive" onClick={async () => {
                      try {
                        await authClient.deleteUser({ callbackURL: "/" });
                        toast.success("Account deleted successfully!");
                        navigate({ to: "/" });
                      } catch (error) {
                        console.error("Failed to delete account:", error);
                        toast.error("Failed to delete account!");
                      }
                    }}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Security Settings */}
      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security and authentication.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Password</Label>
                  <p className="text-muted-foreground text-sm">Change your account credentials.</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex items-center justify-end">
                      <Button variant="outline">
                        <Key className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and a new password to change your password.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...passwordForm}>
                      <form id="password-form" method="post" className="grid gap-4 py-4" onSubmit={passwordForm.handleSubmit(onPasswordchange)}>
                        <div className="grid gap-2">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="currentPassword">
                                  Current Password
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="currentPassword"
                                    type="password"
                                    placeholder="Current Password"
                                    {...field}
                                  />
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
                                <FormLabel htmlFor="newPassword">
                                  New Password
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="New Password"
                                    {...field}
                                  />
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
                                <FormLabel htmlFor="confirmPassword">
                                  Confirm New Password
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm New Password"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          form="password-form"
                          type="submit"
                          className="mt-4"
                          disabled={!passwordForm.formState.isValid || passwordForm.formState.isSubmitting}
                        >
                          {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-muted-foreground text-sm">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                    Enabled
                  </Badge>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
              {/* <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Login Notifications</Label>
                  <p className="text-muted-foreground text-sm">
                    Get notified when someone logs into your account
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator /> */}
              {/* <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Active Sessions</Label>
                  <p className="text-muted-foreground text-sm">
                    Manage devices that are logged into your account
                  </p>
                </div>
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  View Sessions
                </Button>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notification Settings */}
      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose what notifications you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-muted-foreground text-sm">Receive notifications via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Marketing Emails</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive emails about new features and updates
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Weekly Summary</Label>
                  <p className="text-muted-foreground text-sm">
                    Get a weekly summary of your activity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Security Alerts</Label>
                  <p className="text-muted-foreground text-sm">
                    Important security notifications (always enabled)
                  </p>
                </div>
                <Switch checked disabled />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs >
  );
}