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
import { updateUserDataFn } from "@/services/user-service";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../shadcn/ui/dialog";
import React from "react";
import { m } from "@/paraglide/messages";

interface ProfileContentProps {
  currentUser: User;
}

export default function ProfileContent({currentUser}: ProfileContentProps) {
  const navigate = useNavigate();

  const [switchState, setSwitchState] = React.useState(
    typeof window !== 'undefined' ? localStorage.getItem('userRole') === 'artist' : false
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      id: currentUser.id ?? "",
      name: currentUser.name ?? "",
      phone: currentUser.phone ?? "",
      location: currentUser.location ?? "",
      bio: currentUser.bio ?? "",
      role: currentUser?.role === "user" ? "user" : "artist",
    },
  });

  const onSubmit = async (data: UserForm) => {
    console.log("Submitting data:", data);
    try {
      await updateUserDataFn({ data });
      toast.success(m.toast_update_user_success());
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(m.toast_update_user_error());
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
      toast.success(m.toast_passwordchange_success());
      passwordForm.reset();
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error(m.toast_passwordchange_error());
    }
  };

  const handleRoleToggle = async (checked: boolean): Promise<void> => {
    setSwitchState(checked);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', checked ? 'artist' : 'user');
    }
    console.log('User role set to:', checked ? 'artist' : 'user');
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

      await updateUserDataFn({ data: updatedUserData });
      toast.success(`${m.toast_update_userrole_success()} ${newRole}!`);
    } catch (error) {
      console.error(`Failed to update user role to ${newRole}:`, error);
      toast.error(`${m.toast_update_userrole_error()} ${newRole}!`);
      setSwitchState(!checked);
    }
  };

  return (
    <Tabs defaultValue="personal" className="space-y-6 mt-8">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal">{m.tabs_personal()}</TabsTrigger>
        <TabsTrigger value="account">{m.tabs_account()}</TabsTrigger>
        <TabsTrigger value="security">{m.tabs_security()}</TabsTrigger>
        <TabsTrigger value="notifications">{m.tabs_notifications()}</TabsTrigger>
      </TabsList>

      {/* Personal Information */}
      <TabsContent value="personal" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{m.personal_info_title()}</CardTitle>
            <CardDescription>{m.personal_info_description()}</CardDescription>
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
                          {m.personal_name_label()}
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
                          {m.personal_phone_label()}
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
                          {m.personal_location_label()}
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
                          {m.personal_bio_label()}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            id="bio"
                            placeholder={m.personal_bio_placeholder()}
                            rows={4}
                            {...field}
                            value={field.value ?? ""}
                            className="max-h-40"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button form="user-form" type="submit" disabled={!form.formState.isDirty || !form.formState.isValid} onClick={form.handleSubmit(onSubmit)}>{m.button_save()}</Button>
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
            <CardTitle>{m.account_info_title()}</CardTitle>
            <CardDescription>{m.account_info_description()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">{m.account_status()}</Label>
                <p className="text-muted-foreground text-sm">{m.account_status_active()}</p>
              </div>
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                {m.account_status_badge()}
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
                <Label className="text-base">{m.account_switch_role()}</Label>
                <p className="text-muted-foreground text-sm">
                  {m.account_switch_role_description()}
                </p>
              </div>
              <Switch onCheckedChange={handleRoleToggle} checked={switchState} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">{m.account_data_export()}</Label>
                <p className="text-muted-foreground text-sm">{m.account_data_export_description()}</p>
              </div>
              <Button variant="outline">{m.account_data_export()}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">{m.account_danger_zone()}</CardTitle>
            <CardDescription>{m.account_danger_zone_description()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">{m.account_delete()}</Label>
                <p className="text-muted-foreground text-sm">
                  {m.account_delete_description()}
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <Button variant="destructive" onClick={() => setDialogOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {m.account_delete()}
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{m.delete_modal_title()}</DialogTitle>
                    <DialogDescription>{m.delete_modal_description()}</DialogDescription>
                    <Button variant="destructive" onClick={async () => {
                      try {
                        await authClient.deleteUser({ callbackURL: "/" });
                        toast.success(m.toast_delete_account_success());
                        navigate({ to: "/" });
                      } catch (error) {
                        console.error("Failed to delete account:", error);
                        toast.error(m.toast_delete_account_error());
                      }
                    }}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {m.button_delete()}
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
            <CardTitle>{m.security_info_title()}</CardTitle>
            <CardDescription>{m.security_info_description()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">{m.label_password()}</Label>
                  <p className="text-muted-foreground text-sm">{m.security_password_description()}</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <div className="flex items-center justify-end">
                    <Button variant="outline" onClick={() => setDialogOpen(true)}>
                      <Key className="mr-2 h-4 w-4" />
                      {m.security_change_password_button()}
                    </Button>
                  </div>
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
                  <Label className="text-base">{m.security_2fa()}</Label>
                  <p className="text-muted-foreground text-sm">
                    {m.security_2fa_description()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                    {m.security_enabled_badge()}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {m.security_2fa()}
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
            <CardTitle>{m.notifications_info_title()}</CardTitle>
            <CardDescription>{m.notifications_info_description()}</CardDescription>
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