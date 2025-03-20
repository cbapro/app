import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { PassThrough } from 'node:stream';
import { createReadableStreamFromReadable, createCookieSessionStorage, redirect as redirect$2 } from '@remix-run/node';
import { RemixServer, Meta, Links, Outlet, Scripts, useLoaderData, useActionData, useSubmit, useNavigation, Form as Form$1, redirect as redirect$1, Link, useSearchParams, useNavigate, useLocation } from '@remix-run/react';
import * as isbotModule from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';
import * as React from 'react';
import { useState, useEffect, useRef, createContext, useContext, forwardRef, useImperativeHandle } from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Cross2Icon, CaretSortIcon, ChevronUpIcon, ChevronDownIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, ViewVerticalIcon, DotFilledIcon } from '@radix-ui/react-icons';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { Slot } from '@radix-ui/react-slot';
import Parse from 'parse/node.js';
import 'dotenv/config';
import { joiResolver } from '@hookform/resolvers/joi';
import { useFormContext, FormProvider, Controller, useForm } from 'react-hook-form';
import Joi from 'joi';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as SelectPrimitive from '@radix-ui/react-select';
import { LoaderCircle, CalendarIcon, ExternalLink, Info, Telescope, User, Triangle, MenuIcon, ArrowRight, Clock, UserPen, BatteryCharging, BadgeHelp, MessageSquareText, MessageSquareDot, MessageSquareX, Glasses, LogOut, Play as Play$1, X, MousePointerClick, ChevronRight, ChevronDown, ArrowUp, Paperclip, Plus, FileText, Youtube, Bell } from 'lucide-react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import nodemailer from 'nodemailer';
import Stripe from 'stripe';
import { HttpsProxyAgent } from 'https-proxy-agent';
import OpenAI from 'openai';
import { produce } from 'immer';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import Markdown from 'react-markdown';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

const entryServer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: 'Module' }));

const stylesheet = "/assets/tailwind-DBgN4ciO.css";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map();

const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners = [];

let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function toast({
  ...props
}) {
  const id = genId();

  const update = (props) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Root,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(Cross2Icon, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold [&+div]:text-xs", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(ToastPrimitives.Description, { ref, className: cn("text-sm opacity-90", className), ...props }));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

function Toaster() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}

function meta() {
  return [
    {
      title: "CBA pro",
      description: "AI Dashboard"
    }
  ];
}
const links = () => [{ rel: "stylesheet", href: stylesheet }];
function App$1() {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx("link", { rel: "icon", href: "/icon.svg" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx("script", { src: "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" }),
      /* @__PURE__ */ jsx(Toaster, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}

const route0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: App$1,
  links,
  meta
}, Symbol.toStringTag, { value: 'Module' }));

function Logo({
  vartical = false,
  subtitle = false,
  className,
  animate = false,
  title = "CBA",
  text = "AI Dashboard"
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex gap-3 items-center ${vartical ? "flex-col text-center" : ""} ${className} ${animate && "*:animate-pulse"}`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "block w-6 h-6 rounded bg-primary rotate-45 relative", children: /* @__PURE__ */ jsx("i", { className: "w-2 h-2 rounded-full bg-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" }) }),
        subtitle && /* @__PURE__ */ jsxs("span", { className: "grid -space-y-1 text-primary", children: [
          /* @__PURE__ */ jsx("strong", { className: "", children: title }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-light", children: text })
        ] })
      ]
    }
  );
}

const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;

function UsageProgress({ usage, limit = 1e6 }) {
  const [value, setValue] = useState(0);
  const rate = limit / 100;
  useEffect(() => {
    setValue(usage.total >= limit ? 100 : usage.total / rate);
  }, [usage]);
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
      /* @__PURE__ */ jsxs("strong", { className: "text-sm text-zinc-400", children: [
        value.toString().split(".")[0],
        "%"
      ] }),
      /* @__PURE__ */ jsx(Progress, { value })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 justify-between text-sm", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Usage tokens: ",
        /* @__PURE__ */ jsx("strong", { children: usage?.total })
      ] }),
      /* @__PURE__ */ jsxs("span", { children: [
        "Limit tokens: ",
        /* @__PURE__ */ jsx("strong", { children: limit })
      ] })
    ] })
  ] });
}

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    role: "alert",
    className: cn(alertVariants({ variant }), className),
    ...props
  }
));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h5",
  {
    ref,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm [&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      className: cn(buttonVariants({ variant, size, className })),
      ref,
      ...props
    }
  );
});
Button.displayName = "Button";

function AlertModule({
  className,
  icon,
  title,
  description,
  button,
  variant
}) {
  return /* @__PURE__ */ jsxs(Alert, { className: cn(className, variants$1[variant]), children: [
    icon,
    title && /* @__PURE__ */ jsx(AlertTitle, { children: title }),
    description && /* @__PURE__ */ jsx(AlertDescription, { children: description }),
    button && /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "destructive",
        size: "small",
        className: "p-1 px-2 text-xs",
        onClick: button.onClick,
        children: button.title
      }
    ) })
  ] });
}
const variants$1 = {
  default: "",
  success: "text-green-500 border-green-500 [&_button]:bg-green-500",
  destructive: "text-red-500 border-red-500 [&_button]:bg-red-500"
};

const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";

function CardModule({
  className,
  title,
  description,
  children,
  footer
}) {
  return /* @__PURE__ */ jsxs(Card, { className, children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      title && /* @__PURE__ */ jsx(CardTitle, { children: title }),
      description && /* @__PURE__ */ jsx(CardDescription, { children: description })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children }),
    footer && /* @__PURE__ */ jsx(CardFooter, { children: footer })
  ] });
}

// import * as User from "./models/user.server";
// import * as Auth from "./lib/parse/auth.server";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const { getSession, commitSession, destroySession } = sessionStorage;

// export async function getSession(request) {
//   const cookie = request.headers.get("Cookie");
//   return sessionStorage.getSession(cookie);
// }

// export async function getUserSession(request) {
//   const session = await getSession(request);
//   return session.get("user");
// }

// export async function getUser(request) {
//   const user = getUserSession(request);
//   if (!user) return null;

//   const user_ = await User.read(user);
//   if (user_) return user_;

//   throw await logout(request);
// }

// export async function requireUserSession(
//   request,
//   redirectTo = new URL(request.url).pathname
// ) {
//   const user = await getUserSession(request);
//   if (!user) {
//     const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
//     throw redirect(`/auth/login?${searchParams}`);
//   }
//   return user;
// }

// export async function requireUser(request) {
//   const user = await requireUserSession(request);

//   const user_ = await User.read(user);
//   if (user_) return user_;

//   throw await logout(request);
// }

// export async function createUserSession({
//   request,
//   user,
//   remember,
//   redirectTo,
// }) {
//   const session = await getSession(request);
//   session.set("user", user);
//   return redirect(redirectTo, {
//     headers: {
//       "Set-Cookie": await sessionStorage.commitSession(session, {
//         maxAge: remember
//           ? 60 * 60 * 24 * 7 // 7 days
//           : undefined,
//       }),
//     },
//   });
// }

// export async function logout(request) {
//   const session = await getSession(request);
//   const logout = await Auth.logout();
//   return redirect("/", {
//     headers: {
//       "Set-Cookie": await sessionStorage.destroySession(session),
//     },
//   });
// }

const {
  PARSE_CLIENT_URL: clientURL,
  PARSE_CHOOSE_PASSWORD: choosePassword,
  PARSE_INVALID_LINK: invalidLink,
  PARSE_INVALID_VERIFICATION_LINK: invalidVerificationLink,
  PARSE_LINK_SEND_FAIL: linkSendFail,
  PARSE_LINK_SEND_SUCCESS: linkSendSuccess,
  PARSE_FRAME_URL: parseFrameURL,
  PARSE_PASSWORD_RESET_SUCCESS: passwordResetSuccess,
  PARSE_VERIFY_EMAIL_SUCCESS: verifyEmailSuccess,

  APP_ADDITIONAL_MESSAGES: additionalMessages,
  APP_SCORE_REQUEST_LIMIT: scoreRequestLimit,
  APP_SCORE_REQUEST_OUTCOME_LIMIT: scoreRequestOutcomeLimit,
} = process.env;

const vars = {
  app: {
    additionalMessages,
    scoreRequestLimit,
    scoreRequestOutcomeLimit,
  },
  admin: {
    key: process.env.ADMIN_KEY,
  },
  parse: {
    appName: process.env.PARSE_APP_NAME,
    appId: process.env.PARSE_APP_ID,
    masterKey: process.env.PARSE_MASTER_KEY,
    databaseURI: process.env.DB_URI,
    jsKey: process.env.PARSE_JS_KEY,
    restAPIKey: process.env.PARSE_REST_API_KEY,
    serverURL: process.env.PARSE_SERVER_URL,
    publicServerURL: process.env.PARSE_PUBLIC_SERVER_URL,
    cloud: process.env.PARSE_CLOUD,
    port: process.env.PARSE_PORT,
    clientURL,
    customPages: {
      choosePassword: `${clientURL}${choosePassword}`,
      invalidLink: `${clientURL}${invalidLink}`,
      invalidVerificationLink: `${clientURL}${invalidVerificationLink}`,
      linkSendFail: `${clientURL}${linkSendFail}`,
      linkSendSuccess: `${clientURL}${linkSendSuccess}`,
      parseFrameURL: `${clientURL}${parseFrameURL}`,
      passwordResetSuccess: `${clientURL}${passwordResetSuccess}`,
      verifyEmailSuccess: `${clientURL}${verifyEmailSuccess}`,
    },
  },
  database: {
    url: process.env.DB_URI,
  },
  email: {
    service: process.env.EMAIL_SERVICE,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
    recipient: process.env.EMAIL_RECIPIENT,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    scoreAssistantId: process.env.OPENAI_ASSISTANT_ID_SCORE,
    assistantIdDev: process.env.OPENAI_ASSISTANT_ID_DEV,
    assistantId:
      process.env.NODE_ENV === "production"
        ? process.env.OPENAI_ASSISTANT_ID
        : process.env.OPENAI_ASSISTANT_ID_DEV,
  },
  stripe: {
    domain: process.env.STRIPE_DOMAIN,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  jsonServer: {
    url: process.env.JSON_SERVER_URL,
  },
};

const { appId, jsKey, serverURL } = vars.parse;

Parse.initialize(appId, jsKey);
Parse.serverURL = serverURL;

const Class$4 = "Profile";

async function read$3(user) {
  try {
    const query = new Parse.Query(Class$4);
    query.equalTo("user", user.objectId);
    const data = await query.find({ sessionToken: user.sessionToken });
    return data[0];
  } catch (error) {
    console.log("profile.read", error.message);
  }
}

async function update$2(args, sessionToken) {
  try {
    const Profile = Parse.Object.extend(Class$4);
    const profile = new Profile();
    return await profile.save(args, { sessionToken });
  } catch (error) {
    console.log("profile.update", error.message);
  }
}

async function loader$e({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  const profile = (await read$3(user))?.toJSON();
  const limit = 1e6;
  const usage = profile?.usage || { input: 0, total: 0, output: 0 };
  return { limit, usage };
}
function Overview() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
    /* @__PURE__ */ jsxs(CardModule, { className: "shadow-none", title: "Tokens used", children: [
      /* @__PURE__ */ jsx(UsageProgress, { limit: data?.limit, usage: data?.usage }),
      data?.usage.total >= data?.limit && /* @__PURE__ */ jsx(
        AlertModule,
        {
          variant: "destructive",
          className: "mt-8",
          title: "Attention!",
          description: "your tokens used has been Over. Please contact with CTA Administrator",
          button: {
            title: "Contact",
            onClick: () => console.log("Contact with CTA")
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hidden h-full flex- justify-center items-center", children: /* @__PURE__ */ jsx(Logo, { subtitle: true, vartical: true, className: "opacity-25" }) })
  ] });
}

const route1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Overview,
  loader: loader$e
}, Symbol.toStringTag, { value: 'Module' }));

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = LabelPrimitive.Root.displayName;

const Form = FormProvider;
const FormFieldContext = React.createContext({});
const FormField = ({ ...props }) => {
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, { ...props }) });
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = React.createContext({});
const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx("div", { ref, className: cn("space-y-2", className), ...props }) });
});
FormItem.displayName = "FormItem";
const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label,
    {
      ref,
      className: cn(error && "text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    {
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
});
FormControl.displayName = "FormControl";
const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formDescriptionId,
      className: cn("text-[0.8rem] text-muted-foreground", className),
      ...props
    }
  );
});
FormDescription.displayName = "FormDescription";
const FormMessage = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;
    if (!body) {
      return null;
    }
    return /* @__PURE__ */ jsx(
      "p",
      {
        ref,
        id: formMessageId,
        className: cn("text-[0.8rem] font-medium text-destructive", className),
        ...props,
        children: body
      }
    );
  }
);
FormMessage.displayName = "FormMessage";

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:border-zinc-800 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus:ring-zinc-300",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(CaretSortIcon, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUpIcon, {})
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDownIcon, {})
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white text-zinc-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-zinc-100 dark:bg-zinc-800", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      className: cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Input.displayName = "Input";

function SubmitField({
  className,
  variant,
  loader = false,
  disabled = loader,
  label = "Submit",
  type = "submit",
  icon,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Button,
    {
      type,
      variant,
      className: cn("relative shadow-none", loader && "!pl-8", className),
      disabled,
      ...props,
      children: [
        loader && /* @__PURE__ */ jsx(LoaderCircle, { className: "absolute left-2 animate-spin" }),
        icon,
        label
      ]
    }
  );
}

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsx(ScrollBar, {}),
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn("p-3", className),
      classNames: {
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range" ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md" : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames
      },
      components: {
        IconLeft: ({ className: className2, ...props2 }) => /* @__PURE__ */ jsx(ChevronLeftIcon, { className: cn("h-4 w-4", className2), ...props2 }),
        IconRight: ({ className: className2, ...props2 }) => /* @__PURE__ */ jsx(ChevronRightIcon, { className: cn("h-4 w-4", className2), ...props2 })
      },
      ...props
    }
  );
}
Calendar.displayName = "Calendar";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

function CalendarField({ name, label, description, control }) {
  return /* @__PURE__ */ jsx(
    FormField,
    {
      control,
      name,
      render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx(FormLabel, { children: label }),
        /* @__PURE__ */ jsxs(Popover, { children: [
          /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: cn(
                "w-[240px] pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              ),
              children: [
                field.value ? format(field.value, "PPP") : /* @__PURE__ */ jsx("span", { children: "Pick a date" }),
                /* @__PURE__ */ jsx(CalendarIcon, { className: "ml-auto h-4 w-4 opacity-50" })
              ]
            }
          ) }) }),
          /* @__PURE__ */ jsx(
            PopoverContent,
            {
              className: "w-auto p-0 pointer-events-auto",
              align: "start",
              children: /* @__PURE__ */ jsx(
                Calendar,
                {
                  mode: "single",
                  selected: field.value,
                  onSelect: field.onChange,
                  initialFocus: true
                }
              )
            }
          )
        ] }),
        description && /* @__PURE__ */ jsx(FormDescription, { children: description }),
        /* @__PURE__ */ jsx(FormMessage, {})
      ] })
    }
  );
}

const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
  SeparatorPrimitive.Root,
  {
    ref,
    decorative,
    orientation,
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  }
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

async function loader$d({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  let profile = session.get("profile");
  if (profile) return { profile };
  const user = session.get("user");
  profile = await read$3(user);
  if (profile) {
    console.log("settings.profile", profile.id);
    session.set("profile", profile);
    return Response.json(
      { profile },
      {
        headers: {
          "Set-Cookie": await commitSession(session)
        }
      }
    );
  }
  return null;
}
async function action$a({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  const formData = await request.formData();
  const profile = JSON.parse(formData.get("profile"));
  if (profile?.usage) delete profile.usage;
  const data = await update$2(profile, user.sessionToken);
  if (data) {
    session.set("profile", data);
    return Response.json(data, {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    });
  }
  return {
    error: "Api not reachable!"
  };
}
const formSchema = Joi.object({
  firstName: Joi.string().empty(""),
  lastName: Joi.string().empty(""),
  fields: Joi.object({
    linkedin: Joi.string().uri().empty(""),
    discipline: Joi.string(),
    association: Joi.string(),
    validatorsNumber: Joi.number().min(1).max(5),
    validators: Joi.array().items(
      Joi.object({
        name: Joi.string().messages({
          "any.required": `"name" is a required field`,
          "string.empty": `"email" cannot be an empty field`
        }),
        email: Joi.string().email({ tlds: { allow: false } }).messages({
          "string.email": `"email" should be a type of 'text'`,
          "string.empty": `"email" cannot be an empty field`,
          "any.required": `"email" is a required field`
        })
      })
    ),
    CBASubmissionDueDate: Joi.date()
  })
});
function ProfilePage() {
  const data = useLoaderData();
  const aData = useActionData();
  const { firstName, lastName, fields } = data.profile;
  const [validatorsNumber, setValidatorsNumber] = useState(1);
  const { toast } = useToast();
  const submit = useSubmit();
  const { state } = useNavigation();
  const form = useForm({
    resolver: joiResolver(formSchema),
    defaultValues: {
      firstName,
      lastName,
      fields
    }
  });
  function validatorsNumberOnKeyUp(e) {
    const number = Number(e.target.value);
    if (number && number > 0 && number < 6) return setValidatorsNumber(number);
    setValidatorsNumber(1);
  }
  function onSubmit(values) {
    const input = data.profile;
    const output = { ...data.profile, ...values };
    const condition = JSON.stringify(input) === JSON.stringify(output);
    if (!condition) {
      submit({ profile: JSON.stringify(output) }, { method: "post" });
    }
  }
  useEffect(() => {
    if (aData)
      toast({
        title: aData.error ?? "Update complete"
      });
  }, [aData]);
  return /* @__PURE__ */ jsx("div", { className: "h-full", children: /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: form.handleSubmit(onSubmit),
      className: "h-full flex flex-col gap-8",
      children: [
        /* @__PURE__ */ jsx(ScrollArea, { className: "flex-grow [&>div>div]:h-full-", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 overflow-y-auto p-4 pb-16", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "firstName",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(FormLabel, { children: "First name" }),
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "first name", ...field }) }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "lastName",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex-1", children: [
                  /* @__PURE__ */ jsx(FormLabel, { children: "Last name" }),
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "last name", ...field }) }),
                  /* @__PURE__ */ jsx(FormMessage, {})
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "fields.linkedin",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Linkedin" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "linkedin url", ...field }) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "fields.discipline",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Discipline" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    onValueChange: field.onChange,
                    defaultValue: field.value,
                    children: [
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a discipline" }) }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: disciplines.map((discipline, index) => /* @__PURE__ */ jsx(SelectItem, { value: discipline, children: discipline }, index)) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "fields.association",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Association" }),
                /* @__PURE__ */ jsxs(
                  Select,
                  {
                    onValueChange: field.onChange,
                    defaultValue: field.value,
                    children: [
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select an association" }) }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: associations.map((association, index) => /* @__PURE__ */ jsx(SelectItem, { value: association, children: association }, index)) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "fields.validatorsNumber",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: "Number of Validators" }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "1",
                    ...field,
                    onKeyUp: validatorsNumberOnKeyUp
                  }
                ) }),
                /* @__PURE__ */ jsx(FormDescription, { children: "Add number between 1-5" }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          validatorsNumber && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(FormLabel, { children: "Validators" }),
            Array.from({ length: validatorsNumber })?.map(
              (validator, index) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    disabled: true,
                    variant: "ghost",
                    size: "icon",
                    className: "bg-zinc-100 mt-8",
                    children: index + 1
                  }
                ),
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: `fields.validators[${index}].name`,
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex-1", children: [
                      /* @__PURE__ */ jsx(FormLabel, { children: "Name" }),
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "name", ...field }) }),
                      /* @__PURE__ */ jsx(FormMessage, {})
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: `fields.validators[${index}].email`,
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex-1", children: [
                      /* @__PURE__ */ jsx(FormLabel, { children: "Email" }),
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "email", ...field }) }),
                      /* @__PURE__ */ jsx(FormMessage, {})
                    ] })
                  }
                )
              ] }, index)
            )
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsx(
            CalendarField,
            {
              name: "fields.CBASubmissionDueDate",
              label: "CBA Submission Due Date",
              control: form.control
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", {}),
          /* @__PURE__ */ jsx(
            SubmitField,
            {
              label: "Update",
              loader: state === "submitting" || state === "loading"
            }
          )
        ] })
      ]
    }
  ) }) });
}
const disciplines = [
  "Civil",
  "Structural",
  "Building",
  "Environment",
  "Mechanical",
  "Electrical",
  "Chemical",
  "Mining",
  "Materials",
  "Industrial",
  "Others"
];
const associations = [
  "APEGS",
  "PEO",
  "APEGA",
  "EGCB",
  "EGM",
  "QIQ",
  "APEGNB",
  "EPEI",
  "Others"
];

const route2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$a,
  default: ProfilePage,
  loader: loader$d
}, Symbol.toStringTag, { value: 'Module' }));

function Callback() {
  return /* @__PURE__ */ jsx("div", { children: "Callback" });
}

const route3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Callback
}, Symbol.toStringTag, { value: 'Module' }));

function InputField({ ...props }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
    props?.label && /* @__PURE__ */ jsx(Label, { children: props?.label }),
    /* @__PURE__ */ jsx(
      Input,
      {
        ...props,
        ...props?.setValue && {
          onValueChange: props.setValue
        }
      }
    ),
    props?.error && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500", children: props.error })
  ] });
}

const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      CheckboxPrimitive.Indicator,
      {
        className: cn("flex items-center justify-center text-current"),
        children: /* @__PURE__ */ jsx(CheckIcon, { className: "h-4 w-4" })
      }
    )
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

function CheckboxField({ setValue, error, ...props }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-2", children: [
      /* @__PURE__ */ jsx(
        Checkbox,
        {
          ...props,
          ...setValue && {
            onValueChange: setValue
          }
        }
      ),
      /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: props?.id,
          className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          children: props?.label
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500", children: error })
  ] });
}

const getPointer = (className, objectId) => ({
  __type: "Pointer",
  className,
  objectId,
});

// export * as outcomes from "./outcome.server";

const models = {
  user: "_User",
  competency: "Competency",
  thread: "Thread",
  outcome: "Outcome",
};

const Class$3 = "Setting";

async function CREATE$1(args, sessionToken) {
  try {
    const Setting = Parse.Object.extend(Class$3);
    const setting = new Setting();
    return await setting.save(args, { sessionToken });
  } catch (error) {
    console.log("setting.create", error.message);
  }
}

async function READ(user) {
  try {
    const query = new Parse.Query(Class$3);
    query.equalTo("user", user.objectId);
    return await query.first({ sessionToken: user.sessionToken });
  } catch (error) {
    console.log("setting.read", error.message);
  }
}

async function UPDATE(args, sessionToken) {
  try {
    const Setting = Parse.Object.extend(Class$3);
    const setting = new Setting();
    return await setting.save(args, { sessionToken });
  } catch (error) {
    console.log("setting.update", error.message);
  }
}

async function UPSERT(user, data) {
  const setting = await READ(user);
  const args = {
    user: getPointer(models.user, user.objectId),
    consent: data.consent,
  };
  if (setting) return await UPDATE(args, user.sessionToken);
  return await CREATE$1(args, user.sessionToken);
}

const schema = Joi.object({
  fullName: Joi.string().required(),
  termsConditions: Joi.string().required(),
  privacyPolicy: Joi.string().required(),
  appRules: Joi.string().required()
});
async function loader$c({ request }) {
  const session = await getSession(request.headers.get("cookie"));
  const user = session.get("user");
  let setting = session.get("setting");
  if (!user) return redirect$1("/auth/login");
  console.log("auth.consent.loader", user.objectId);
  if (!setting) setting = (await READ(user))?.toJSON();
  if (user && setting?.consent) return redirect$1("/app");
  return null;
}
async function action$9({ request }) {
  const session = await getSession(request.headers.get("cookie"));
  const user = session.get("user");
  console.log("auth.consent.action", user.objectId);
  const formData = await request.formData();
  const fullName = formData.get("fullName");
  const termsConditions = formData.get("termsConditions");
  const privacyPolicy = formData.get("privacyPolicy");
  const appRules = formData.get("appRules");
  const consent = { fullName, termsConditions, privacyPolicy, appRules };
  try {
    await schema.validateAsync(consent, { abortEarly: false });
    const setting = await UPSERT(user, { consent });
    session.set("setting", setting);
    return redirect$1("/app", {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    });
  } catch (error) {
    return {
      error: error.details
    };
  }
}
function Consent() {
  const actionData = useActionData();
  const { state } = useNavigation();
  return /* @__PURE__ */ jsxs(Form$1, { method: "post", className: "grid gap-6", children: [
    /* @__PURE__ */ jsx(
      InputField,
      {
        name: "fullName",
        label: "Full name",
        rquired: "true",
        error: actionData?.error?.find((i) => i.context.key === "fullName")?.message
      }
    ),
    /* @__PURE__ */ jsx("center", { children: /* @__PURE__ */ jsx("small", { children: (/* @__PURE__ */ new Date()).toUTCString() }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
      /* @__PURE__ */ jsx(
        CheckboxField,
        {
          name: "termsConditions",
          label: "I acknowledge and agree to the terms and conditions",
          rquired: "true",
          error: actionData?.error?.find((i) => i.context.key === "termsConditions")?.message
        }
      ),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/terms-conditions.pdf",
          target: "_blank",
          className: "flex items-center gap-1 text-primary text-xs rounded-full px-2 h-7 leading-6 border border-primary",
          children: [
            /* @__PURE__ */ jsx(ExternalLink, { size: 16 }),
            "View"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
      /* @__PURE__ */ jsx(
        CheckboxField,
        {
          name: "privacyPolicy",
          label: "I acknowledge and agree to the Privacy Policy",
          rquired: "true",
          error: actionData?.error?.find((i) => i.context.key === "privacyPolicy")?.message
        }
      ),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/privacy-policy.pdf",
          target: "_blank",
          className: "flex items-center gap-1 text-primary text-xs rounded-full px-2 h-7 leading-6 border border-primary",
          children: [
            /* @__PURE__ */ jsx(ExternalLink, { size: 16 }),
            "View"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      CheckboxField,
      {
        name: "appRules",
        label: "I consent to the ethical use of the dashboard, affirm that all work experience examples provided are factual, and agree that CertNova may disclose my AI chat history to engineering associations upon request.",
        rquired: "true",
        error: actionData?.error?.find((i) => i.context.key === "appRules")?.message
      }
    ),
    /* @__PURE__ */ jsx(
      SubmitField,
      {
        label: "I Agree",
        className: "mt-8",
        loader: state === "submitting" || state === "loading"
      }
    )
  ] });
}

const route4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$9,
  default: Consent,
  loader: loader$c
}, Symbol.toStringTag, { value: 'Module' }));

function isMobileServer(request) {
  var ua = request.headers.get("user-agent").toLowerCase();
  const is =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      ua
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      ua.substr(0, 4)
    );
  return is ? true : false;
}

const { TURNSTILE_SECRET_KEY: secretKey, TURNSTILE_VERIFY_URL: verifyUrl } =
  process.env;

async function challenge({ form }) {
  const token = form.get("cf-turnstile-response");

  try {
    const res = await fetch(verifyUrl, {
      method: "POST",
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    // console.log(token, data);

    if (data.success) return true;
    return { error: "Turnstile verification failed" };
  } catch (error) {
    console.log("turnstile.challenge", error?.message);
    return { error: "Error verifying Turnstile token" };
  }
}

async function remember(email) {
  try {
    const remember = await Parse.User.requestPasswordReset(email);
    console.log("parse.auth.remember", remember);
    return remember;
  } catch (error) {
    console.log("parse.auth.remember.error", error.code, error.message);
  }
}

async function reset({ password, username, token }) {
  const body = new URLSearchParams({
    new_password: password,
    confirm_new_password: password,
    username,
    token,
    "utf-8": "✓",
  });

  try {
    const data = await fetch(
      `${vars.parse.serverURL}/apps/${vars.parse.appId}/request_password_reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );

    // console.log("parse.auth.reset", data);
    const url = new URLSearchParams(data?.url);

    const success = data?.url.includes("success");
    const failed = data?.url.includes("failed");
    const error = url.get("error");

    if (error) return false;
    return true;
  } catch (error) {
    console.log(error);
  }
}

async function login(username, password) {
  try {
    return await Parse.User.logIn(username, password);
  } catch (error) {
    console.log("parse:auth:login", error.message);
    return { error: error.message };
  }
}

async function logout$1() {
  try {
    return await Parse.User.logOut();
  } catch (error) {
    console.log("parse:auth:logout", error.message);
    // return { error: error.message };
  }
}

let authenticator = new Authenticator();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");

    const challenge$1 = await challenge({ form });
    if (challenge$1.error)
      return { error: challenge$1.error, errorType: "challenge" };

    return await login(email, password);
  }),
  "user-pass"
);

async function logout() {
  await logout$1();
}

let isHydrating = true;
function Turnstile({ onChange, error }) {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);
  const [token, setToken] = useState(null);
  const ref = useRef();
  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);
  useEffect(() => {
    if (ref.current) {
      turnstile.remove();
      turnstile.render(ref.current, {
        sitekey: "0x4AAAAAAA8rbrKZhit0xcFU",
        size: "flexible",
        theme: "light",
        callback: function(token2) {
          setToken(token2);
          onChange?.({ target: { value: token2 } });
        },
        "error-callback": function(args) {
          console.log(args);
        }
      });
    }
  }, [ref.current]);
  useEffect(() => {
    if (error) turnstile.reset();
  }, [error]);
  return isHydrated ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { ref }),
    !token && /* @__PURE__ */ jsx(
      "input",
      {
        required: true,
        className: "pointer-events-none w-full h-[1px] focus:outline-none text-[0px] text-white -!my-4"
      }
    )
  ] }) : null;
}

async function loader$b({ request }) {
  console.log("auth:login:loader");
  if (isMobileServer(request)) return redirect$2("/mobile");
  let session = await getSession(request.headers.get("cookie"));
  let user = session.get("user");
  if (user) throw redirect$2("/app");
  return null;
}
async function action$8({ request }) {
  console.log("auth:login:action");
  const session = await getSession(request.headers.get("cookie"));
  let user;
  try {
    user = await authenticator.authenticate("user-pass", request);
  } catch (error) {
    if (error instanceof Error) {
      console.log("ERROR");
    }
    throw error;
  }
  if (user?.error) return { error: user.error, errorType: user?.errorType };
  session.set("user", user);
  throw redirect$2("/auth/consent", {
    headers: { "Set-Cookie": await commitSession(session) }
  });
}
function Login() {
  const actionData = useActionData();
  const { state } = useNavigation();
  return /* @__PURE__ */ jsxs(Form$1, { method: "post", className: "grid gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
      /* @__PURE__ */ jsx(Input, { name: "email", type: "email", required: true })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/auth/reset",
            className: "ml-auto inline-block-- text-sm underline",
            children: "Forgot your password?"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Input, { name: "password", type: "password", required: true })
    ] }),
    /* @__PURE__ */ jsx(
      Turnstile,
      {
        error: actionData?.errorType === "challenge" ? actionData.error : null
      }
    ),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "submit",
          className: "w-full relative",
          disabled: state === "submitting" || state === "loading",
          children: [
            (state === "submitting" || state === "loading") && /* @__PURE__ */ jsx(LoaderCircle, { className: "absolute left-2 animate-spin" }),
            "Login"
          ]
        }
      ),
      actionData?.error && state !== "loading" && /* @__PURE__ */ jsx("div", { className: "text-sm text-red-500", children: actionData.error }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full hidden", children: "Login with Google" })
    ] }),
    /* @__PURE__ */ jsxs(
      "a",
      {
        href: "https://competencybasedassessment.ca/cba-intake-form/",
        target: "_blank",
        className: "mt-4 text-center text-sm flex gap-4 justify-center border border-primary rounded-md py-1.5 text-primary",
        children: [
          "Don't have an account?",
          /* @__PURE__ */ jsx("span", { className: "underline", children: "Sign up" })
        ]
      }
    )
  ] });
}

const route5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$8,
  default: Login,
  loader: loader$b
}, Symbol.toStringTag, { value: 'Module' }));

function AlertField({ message, variant }) {
  if (!message) return null;
  return /* @__PURE__ */ jsxs(Alert, { className: cn("px-2 pt-2.5 pb-1.5", variants[variant]), children: [
    /* @__PURE__ */ jsx(Info, { className: "!left-2 !top-2 h-4 w-4" }),
    /* @__PURE__ */ jsx(AlertTitle, { children: message.title }),
    /* @__PURE__ */ jsx(AlertDescription, { className: "text-xs", children: message.description })
  ] });
}
const variants = {
  error: "text-red-500 [&>svg]:text-red-500 border-red-500",
  success: "text-green-500 [&>svg]:text-green-500 border-green-500"
};

const emailSchema = Joi.string().email().required().label("Email");
const passwordSchema = Joi.string().min(8).regex(/[A-Z]/, "upper-case").regex(/[a-z]/, "lower-case").regex(/[^\w]/, "special character").regex(/[0-9]/, "number").required().label("Password");
async function loader$a({ request }) {
  const url = new URL(request.url);
  const link = url.searchParams.get("link");
  const token = url.searchParams.get("token");
  const username = url.searchParams.get("username");
  if (link) return redirect$2(`/auth/reset?token=${token}&username=${username}`);
  return null;
}
async function action$7({ request }) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const username = url.searchParams.get("username");
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const challenge$1 = await challenge({ form });
  if (challenge$1.error)
    return { error: true, message: challenge$1.error, errorType: "challenge" };
  if (token) {
    if (!password)
      return {
        error: true,
        message: { title: "Password is required!" }
      };
    const validate2 = passwordSchema.validate(password, { abortEarly: false });
    if (validate2?.error)
      return {
        error: true,
        message: { title: validate2.error.details[0].message }
      };
    const reset$1 = await reset({ password, username, token });
    if (!reset$1)
      return {
        error: true,
        message: { title: "Email or token invalid, chack again!" }
      };
    return {
      message: { title: "Your password has been changed" }
    };
  }
  if (!email)
    return {
      error: true,
      message: { title: "Email is required!" }
    };
  const validate = emailSchema.validate(email);
  if (validate?.error)
    return {
      error: true,
      message: { title: validate.error.details[0].message }
    };
  const remember$1 = await remember(email);
  if (!remember$1)
    return {
      error: true,
      message: { title: "Email is found!" }
    };
  return {
    message: { title: "Check your email" }
  };
}
function Reset() {
  const adata = useActionData();
  const { state } = useNavigation();
  const formRef = useRef();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  useEffect(() => {
    if (state === "loading") formRef.current.reset();
  }, [state]);
  return /* @__PURE__ */ jsxs(Form$1, { ref: formRef, method: "post", className: "space-y-4", children: [
    /* @__PURE__ */ jsx(
      InputField,
      {
        required: true,
        type: token ? "password" : "email",
        name: token ? "password" : "email",
        label: token ? "New password" : "Email"
      }
    ),
    /* @__PURE__ */ jsx(
      Turnstile,
      {
        error: adata?.errorType === "challenge" ? adata.message : null
      }
    ),
    /* @__PURE__ */ jsx(
      SubmitField,
      {
        label: token ? "Reset password" : "Remember password",
        loader: state === "submitting" || state === "loading",
        className: "w-full"
      }
    ),
    /* @__PURE__ */ jsx(
      AlertField,
      {
        variant: adata?.error ? "error" : "success",
        message: adata?.message
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "text-sm p-8 text-center", children: /* @__PURE__ */ jsx(Link, { to: "/auth/login", children: "Back to Login" }) })
  ] });
}

const route6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$7,
  default: Reset,
  loader: loader$a
}, Symbol.toStringTag, { value: 'Module' }));

const Class$2 = "Outcome";

async function read$2(user, thread) {
  try {
    const query = new Parse.Query(Class$2);
    user && query.equalTo("user", user.objectId);
    thread && query.equalTo("thread", thread.objectId || thread.id);
    return await query.find({ sessionToken: user.sessionToken });
  } catch (error) {
    console.log("outcome.read", error.message);
  }
}

async function create$2(arg, sessionToken) {
  try {
    const Outcome = Parse.Object.extend("Outcome");
    const outcome = new Outcome();
    return await outcome.save(arg, { sessionToken });
  } catch (error) {
    console.log("outcome.create", error.message);
  }
}

async function update$1(arg, sessionToken) {
  try {
    const Outcome = Parse.Object.extend("Outcome");
    const outcome = new Outcome();
    return await outcome.save(arg, { sessionToken });
  } catch (error) {
    console.log("outcome.update", error.message);
  }
}

const flags$2 = {
  idle: "idle",
  pending: "pending",
  approved: "approved",
};

async function loader$9({ request }) {
  return redirect$2("/app");
}
async function action$6({ request, params }) {
  console.log("outcomes.action", params.action);
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) return redirect$2("/auth/login");
  let result;
  const thread = session.get("thread");
  const action2 = params.action;
  if (action2 === "create") {
    const { competency } = await request.json();
    result = await create$2(
      {
        user: getPointer(models.user, user.objectId),
        thread: getPointer(models.thread, thread.objectId),
        competency: getPointer(models.competency, competency.objectId),
        flag: flags$2.idle
      },
      user.sessionToken
    );
  }
  if (action2 === "get") {
    result = await read$2(user, thread);
  }
  if (action2 === "update") {
    const body = await request.json();
    result = await update$1(
      {
        ...body
      },
      user.sessionToken
    );
  }
  return Response.json(result);
}
const outcomeSchema = {
  id: "id",
  userId: "userId",
  threadId: "userId",
  competencyId: "competencyId",
  competencyItemId: "competencyItemId",
  situation: null,
  action: null,
  outcome: null,
  flag: "idle"
};

const route7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$6,
  loader: loader$9,
  outcomeSchema
}, Symbol.toStringTag, { value: 'Module' }));

const Breadcrumb = React.forwardRef(
  ({ ...props }, ref) => /* @__PURE__ */ jsx("nav", { ref, "aria-label": "breadcrumb", ...props })
);
Breadcrumb.displayName = "Breadcrumb";
const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ol",
  {
    ref,
    className: cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    ),
    ...props
  }
));
BreadcrumbList.displayName = "BreadcrumbList";
const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "li",
  {
    ref,
    className: cn("inline-flex items-center gap-1.5", className),
    ...props
  }
));
BreadcrumbItem.displayName = "BreadcrumbItem";
const BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      className: cn("transition-colors hover:text-foreground", className),
      ...props
    }
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";
const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "span",
  {
    ref,
    role: "link",
    "aria-disabled": "true",
    "aria-current": "page",
    className: cn("font-normal text-foreground", className),
    ...props
  }
));
BreadcrumbPage.displayName = "BreadcrumbPage";
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "li",
  {
    role: "presentation",
    "aria-hidden": "true",
    className: cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
    ...props,
    children: children ?? /* @__PURE__ */ jsx(ChevronRightIcon, {})
  }
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(
          DialogPrimitive.Close,
          {
            className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
            children: [
              /* @__PURE__ */ jsx(Cross2Icon, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
            ]
          }
        )
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(void 0);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetPortal = DialogPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(DialogPrimitive.Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Close,
      {
        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
        children: [
          /* @__PURE__ */ jsx(Cross2Icon, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ]
      }
    ),
    children
  ] })
] }));
SheetContent.displayName = DialogPrimitive.Content.displayName;
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-primary/10", className),
      ...props
    }
  );
}

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
const SidebarProvider = React.forwardRef(
  ({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
  }, ref) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );
    const toggleSidebar = React.useCallback(() => {
      return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
    }, [isMobile, setOpen, setOpenMobile]);
    React.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);
    const state = open ? "expanded" : "collapsed";
    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );
    return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style
        },
        className: cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          className
        ),
        ref,
        ...props,
        children
      }
    ) }) });
  }
);
SidebarProvider.displayName = "SidebarProvider";
const Sidebar = React.forwardRef(
  ({
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...props
  }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    if (collapsible === "none") {
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          ),
          ref,
          ...props,
          children
        }
      );
    }
    if (isMobile) {
      return /* @__PURE__ */ jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsx(
        SheetContent,
        {
          "data-sidebar": "sidebar",
          "data-mobile": "true",
          className: "w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
          style: {
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE
          },
          side,
          children: /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
        }
      ) });
    }
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: "group peer hidden md:block text-sidebar-foreground",
        "data-state": state,
        "data-collapsible": state === "collapsed" ? collapsible : "",
        "data-variant": variant,
        "data-side": side,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
                "group-data-[collapsible=offcanvas]:w-0",
                "group-data-[side=right]:rotate-180",
                variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
                side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
                // Adjust the padding for floating and inset variants.
                variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
                className
              ),
              ...props,
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  "data-sidebar": "sidebar",
                  className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
                  children
                }
              )
            }
          )
        ]
      }
    );
  }
);
Sidebar.displayName = "Sidebar";
const SidebarTrigger = React.forwardRef(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();
    return /* @__PURE__ */ jsxs(
      Button,
      {
        ref,
        "data-sidebar": "trigger",
        variant: "ghost",
        size: "icon",
        className: cn("h-7 w-7", className),
        onClick: (event) => {
          onClick?.(event);
          toggleSidebar();
        },
        ...props,
        children: [
          /* @__PURE__ */ jsx(ViewVerticalIcon, {}),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
        ]
      }
    );
  }
);
SidebarTrigger.displayName = "SidebarTrigger";
const SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsx(
    "button",
    {
      ref,
      "data-sidebar": "rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: toggleSidebar,
      title: "Toggle Sidebar",
      className: cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      ),
      ...props
    }
  );
});
SidebarRail.displayName = "SidebarRail";
const SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "main",
    {
      ref,
      className: cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      ),
      ...props
    }
  );
});
SidebarInset.displayName = "SidebarInset";
const SidebarInput = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    Input,
    {
      ref,
      "data-sidebar": "input",
      className: cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      ),
      ...props
    }
  );
});
SidebarInput.displayName = "SidebarInput";
const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarHeader.displayName = "SidebarHeader";
const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarFooter.displayName = "SidebarFooter";
const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    Separator,
    {
      ref,
      "data-sidebar": "separator",
      className: cn("mx-2 w-auto bg-sidebar-border", className),
      ...props
    }
  );
});
SidebarSeparator.displayName = "SidebarSeparator";
const SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
});
SidebarContent.displayName = "SidebarContent";
const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
});
SidebarGroup.displayName = "SidebarGroup";
const SidebarGroupLabel = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-sidebar": "group-label",
        className: cn(
          "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          className
        ),
        ...props
      }
    );
  }
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";
const SidebarGroupAction = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-sidebar": "group-action",
        className: cn(
          "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          // Increases the hit area of the button on mobile.
          "after:absolute after:-inset-2 after:md:hidden",
          "group-data-[collapsible=icon]:hidden",
          className
        ),
        ...props
      }
    );
  }
);
SidebarGroupAction.displayName = "SidebarGroupAction";
const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-sidebar": "group-content",
    className: cn("w-full text-sm", className),
    ...props
  }
));
SidebarGroupContent.displayName = "SidebarGroupContent";
const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu",
    className: cn("flex w-full min-w-0 flex-col gap-1", className),
    ...props
  }
));
SidebarMenu.displayName = "SidebarMenu";
const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "li",
  {
    ref,
    "data-sidebar": "menu-item",
    className: cn("group/menu-item relative", className),
    ...props
  }
));
SidebarMenuItem.displayName = "SidebarMenuItem";
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const SidebarMenuButton = React.forwardRef(
  ({
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();
    const button = /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-sidebar": "menu-button",
        "data-size": size,
        "data-active": isActive,
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
        ...props
      }
    );
    if (!tooltip) {
      return button;
    }
    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip
      };
    }
    return /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ jsx(
        TooltipContent,
        {
          side: "right",
          align: "center",
          hidden: state !== "collapsed" || isMobile,
          ...tooltip
        }
      )
    ] });
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
const SidebarMenuAction = React.forwardRef(
  ({ className, asChild = false, showOnHover = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-sidebar": "menu-action",
        className: cn(
          "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
          // Increases the hit area of the button on mobile.
          "after:absolute after:-inset-2 after:md:hidden",
          "peer-data-[size=sm]/menu-button:top-1",
          "peer-data-[size=default]/menu-button:top-1.5",
          "peer-data-[size=lg]/menu-button:top-2.5",
          "group-data-[collapsible=icon]:hidden",
          showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
          className
        ),
        ...props
      }
    );
  }
);
SidebarMenuAction.displayName = "SidebarMenuAction";
const SidebarMenuBadge = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-sidebar": "menu-badge",
    className: cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    ),
    ...props
  }
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
const SidebarMenuSkeleton = React.forwardRef(
  ({ className, showIcon = false, ...props }, ref) => {
    const width = React.useMemo(() => {
      return `${Math.floor(Math.random() * 40) + 50}%`;
    }, []);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        "data-sidebar": "menu-skeleton",
        className: cn("rounded-md h-8 flex gap-2 px-2 items-center", className),
        ...props,
        children: [
          showIcon && /* @__PURE__ */ jsx(
            Skeleton,
            {
              className: "size-4 rounded-md",
              "data-sidebar": "menu-skeleton-icon"
            }
          ),
          /* @__PURE__ */ jsx(
            Skeleton,
            {
              className: "h-4 flex-1 max-w-[--skeleton-width]",
              "data-sidebar": "menu-skeleton-text",
              style: {
                "--skeleton-width": width
              }
            }
          )
        ]
      }
    );
  }
);
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
const SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu-sub",
    className: cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    ),
    ...props
  }
));
SidebarMenuSub.displayName = "SidebarMenuSub";
const SidebarMenuSubItem = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, ...props }));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
const SidebarMenuSubButton = React.forwardRef(
  ({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-sidebar": "menu-sub-button",
        "data-size": size,
        "data-active": isActive,
        className: cn(
          "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          "group-data-[collapsible=icon]:hidden",
          className
        ),
        ...props
      }
    );
  }
);
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

const data$1 = {
  nav: [
    {
      name: "overview",
      label: "Overview",
      icon: Telescope,
      to: "overview"
    },
    {
      name: "profile",
      label: "Profile",
      icon: User,
      to: "profile"
    }
  ]
};
function Settings() {
  const [open, setOpen] = useState(true);
  const [nav, setNav] = useState(data$1.nav[0]);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const name = location.pathname.replace("/app/settings/", "");
    const nav2 = data$1.nav.find((nav3) => nav3.name === name);
    setNav(nav2);
  }, []);
  function onNav(nav2) {
    setNav(nav2);
  }
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: (open2) => !open2 && navigate("/app"), children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true }),
    /* @__PURE__ */ jsxs(
      DialogContent,
      {
        className: "overflow-hidden p-0 md:max-h-[600px] md:max-w-[700px] lg:max-w-[900px]",
        onInteractOutside: (e) => {
          e.preventDefault();
        },
        children: [
          /* @__PURE__ */ jsx(DialogTitle, { className: "sr-only", children: "Settings" }),
          /* @__PURE__ */ jsx(DialogDescription, { className: "sr-only", children: "Customize your settings here." }),
          /* @__PURE__ */ jsxs(SidebarProvider, { className: "items-start", children: [
            /* @__PURE__ */ jsx(Sidebar, { collapsible: "none", className: "hidden md:flex", children: /* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsx(SidebarGroup, { children: /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: data$1.nav.map((item) => /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(
              SidebarMenuButton,
              {
                asChild: true,
                isActive: item.name === nav.name,
                children: /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: item.to,
                    className: "data-[active=true]:!text-primary",
                    onClick: () => onNav(item),
                    children: [
                      /* @__PURE__ */ jsx(item.icon, {}),
                      item.label
                    ]
                  }
                )
              }
            ) }, item.name)) }) }) }) }) }),
            /* @__PURE__ */ jsxs("main", { className: "flex h-[600px] flex-1 flex-col overflow-hidden", children: [
              /* @__PURE__ */ jsx("header", { className: "flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 px-4", children: /* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsxs(BreadcrumbList, { children: [
                /* @__PURE__ */ jsx(BreadcrumbItem, { className: "hidden md:block", children: /* @__PURE__ */ jsx(BreadcrumbLink, { href: "#", children: "Settings" }) }),
                /* @__PURE__ */ jsx(BreadcrumbSeparator, { className: "hidden md:block" }),
                /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: nav.label }) })
              ] }) }) }) }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0", children: /* @__PURE__ */ jsx(Outlet, {}) })
            ] })
          ] })
        ]
      }
    )
  ] });
}

const route8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Settings
}, Symbol.toStringTag, { value: 'Module' }));

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[60px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";

function TextareaField({
  ...props
}) {
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
    props?.label && /* @__PURE__ */ jsx(Label, { children: props?.label }),
    /* @__PURE__ */ jsx(
      Textarea,
      {
        ...props,
        ...props?.setValue && {
          onValueChange: props?.setValue
        }
      }
    ),
    props?.error && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500", children: props.error })
  ] });
}

function module (options) {
  var transporter = nodemailer.createTransport({
    service: options.service,
    auth: {
      user: options.email,
      pass: options.password,
    },
  });

  const sendMail = function (mail) {
    console.log("sendMail");
    return new Promise(function (resolve, reject) {
      var mailOptions = {
        from: options.from,
        sender: options.sender,
        to: [mail.to],
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        attachments: mail.attachments,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Message sent: " + info.response);
          resolve(info);
        }
      });
    });
  };

  return {
    sendMail,
  };
}

const { service, username: email, password, from } = vars.email;

const options = {
  service,
  email,
  password,
};

const Email = async ({ payload }) =>
  module(options).sendMail({
    from,
    sender: from,
    ...payload,
  });

async function loader$8() {
  return null;
}
async function action$5({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) redirect$2("/app");
  let profile = session.get("profile");
  const formData = await request.formData();
  const type = formData.get("type");
  const subject = formData.get("subject");
  const message = formData.get("message");
  if (!profile) profile = (await read$3(user))?.toJSON();
  if (profile) {
    delete profile.objectId;
    delete profile.user;
    profile.user = {
      email: user?.email
    };
  }
  console.log({
    type,
    subject,
    message,
    profile
  });
  const payload = {
    from: "notify@cbapro.ca",
    to: "info@competencybasedassessment.ca",
    subject: `${types$1[type].title}: ${subject}`,
    text: `${message} 

 ${JSON.stringify(profile)}`
  };
  try {
    await Email({ payload });
    console.log("email has been sent!");
    return {
      message: "Your message sent."
    };
  } catch (error) {
    console.log("app.contact.email", error?.message);
    return {
      error: true,
      message: error?.message
    };
  }
  return null;
}
function Contact() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useNavigation();
  const ref = useRef();
  const adata = useActionData();
  const type = searchParams.get("type");
  if (!type || !types$1[type]) return null;
  useEffect(() => {
    if (state === "loading") ref?.current.reset();
  }, [state]);
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: (open2) => !open2 && navigate("/app"), children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: cn("overflow-hidden", types$1[type].className),
      children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: types$1[type].title }),
        /* @__PURE__ */ jsx(DialogDescription, { children: types$1[type].description }),
        /* @__PURE__ */ jsxs(Form$1, { ref, method: "post", className: "space-y-4", children: [
          /* @__PURE__ */ jsx(InputField, { name: "subject", label: "Subject", required: true }),
          /* @__PURE__ */ jsx(TextareaField, { name: "message", label: "Message", required: true }),
          /* @__PURE__ */ jsx(
            SubmitField,
            {
              name: "type",
              value: type,
              label: "Send Issue",
              loader: state === "submitting" || state === "loading"
            }
          )
        ] }),
        adata && /* @__PURE__ */ jsx("span", { className: adata.error ? "text-red-500" : "text-green-500", children: adata.message }),
        type === types$1.reviewer.name && /* @__PURE__ */ jsx(Reviewer, {})
      ]
    }
  ) });
}
const types$1 = {
  help: {
    name: "help",
    label: "Help",
    title: "Request for help",
    description: "",
    className: ""
  },
  reviewer: {
    name: "reviewer",
    label: "Reviewer",
    title: "Requests for reviewer",
    description: "",
    className: "md:max-w-[64rem]"
  }
};
function Reviewer() {
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-2 text-sm text-zinc-500", children: [
    /* @__PURE__ */ jsx("strong", { children: "Professional Engineer (P.Eng.)" }),
    /* @__PURE__ */ jsx("p", { children: "CBA Review Service Get Expert Feedback Before You Submit Navigating the Competency-Based Assessment (CBA) process for your P.Eng. licensure can be challenging. Ensuring your submission effectively demonstrates your engineering competencies is crucial for success. Our P.Eng. Reviewer Service provides you with expert feedback from a licensed Professional Engineer in your discipline, helping you refine and strengthen your CBA before submission." }),
    /* @__PURE__ */ jsx("strong", { children: "Why Choose Our P.Eng. Reviewer Service?" }),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc px-4 text-xs", children: [
      /* @__PURE__ */ jsx("li", { children: "Discipline-Specific Review – We match you with a P.Eng. in your field to ensure a relevant and informed evaluation of your competencies." }),
      /* @__PURE__ */ jsx("li", { children: "Comprehensive QA/QC – Our reviewers assess your submission for clarity, completeness, and alignment with regulatory expectations." }),
      /* @__PURE__ */ jsx("li", { children: "Detailed Feedback & Recommendations – Receive constructive comments and actionable suggestions to enhance your CBA responses." }),
      /* @__PURE__ */ jsx("li", { children: "Increased Success Rate – A well-reviewed submission reduces the risk of deficiencies or requests for additional information from the regulator." })
    ] }),
    /* @__PURE__ */ jsx("strong", { children: "How It Works" }),
    /* @__PURE__ */ jsx("p", { children: "Submit Your CBA Draft – Send us your competency write-ups for review. Assigned P.Eng. Reviewer – We match you with an experienced P.Eng. in your discipline. Detailed Review & Feedback – Your reviewer provides comments, suggestions, and areas for improvement. Refine & Finalize – Use the feedback to strengthen your submission before applying." }),
    /* @__PURE__ */ jsx("strong", { children: "Who Can Benefit?" }),
    /* @__PURE__ */ jsxs("ul", { className: "list-disc px-4 text-xs", children: [
      /* @__PURE__ */ jsx("li", { children: "Engineers preparing their P.Eng. CBA submission" }),
      /* @__PURE__ */ jsx("li", { children: "Those seeking a second opinion from an industry expert" }),
      /* @__PURE__ */ jsx("li", { children: "Applicants aiming to avoid common pitfalls and improve their chances of success" })
    ] })
  ] });
}

const route9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$5,
  default: Contact,
  loader: loader$8
}, Symbol.toStringTag, { value: 'Module' }));

const stripe = new Stripe(vars.stripe.secretKey, {
  ...(process.env.USE_OPENAI_PROXY &&
    process.env.NODE_ENV === "development" && {
      httpAgent: new HttpsProxyAgent(process.env.PROXY_URL),
    }),
});

// checkout.session.completed
// billing_portal.session.created

async function action$4({ request }) {
  const event = await getStripeEvent(request);
  let subscription, status;

  switch (event.type) {
    case "customer.updated":
      subscription = event.data.object;
      status = subscription.status;
      console.log(event.data);
      // console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription trial ending.
      // handleSubscriptionTrialEnding(subscription);
      break;
    case "customer.subscription.trial_will_end":
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription trial ending.
      // handleSubscriptionTrialEnding(subscription);
      break;
    case "customer.subscription.deleted":
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscriptionDeleted);
      break;
    case "customer.subscription.created":
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription created.
      // handleSubscriptionCreated(subscription);
      break;
    case "customer.subscription.updated":
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription update.
      // handleSubscriptionUpdated(subscription);
      break;
    case "entitlements.active_entitlement_summary.updated":
      subscription = event.data.object;
      console.log(`Active entitlement summary updated for ${subscription}.`);
      // Then define and call a method to handle active entitlement summary updated
      // handleEntitlementUpdated(subscription);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
  // Return a 200 response to acknowledge receipt of the event
  return new Response(null);
}

async function getStripeEvent(request) {
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    vars.stripe.webhookSecret
  );
  return event;
}

const route10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$4
}, Symbol.toStringTag, { value: 'Module' }));

const navigation = [
  { name: "Features", href: "#" },
  { name: "Guideline", href: "#" },
  { name: "Support", href: "#" },
  { name: "Company", href: "#" }
];
async function loader$7({ request }) {
  return redirect$2("/app");
}
function Index() {
  useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "bg-white", children: [
    /* @__PURE__ */ jsx("header", { className: "absolute inset-x-0 top-0 z-50", children: /* @__PURE__ */ jsxs(
      "nav",
      {
        "aria-label": "Global",
        className: "flex items-center justify-between p-6 lg:px-8",
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex lg:flex-1", children: /* @__PURE__ */ jsx(Triangle, { className: "size-5 fill-foreground" }) }),
          /* @__PURE__ */ jsx("div", { className: "flex lg:hidden", children: /* @__PURE__ */ jsxs(Sheet, { children: [
            /* @__PURE__ */ jsxs(SheetTrigger, { children: [
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open main menu" }),
              /* @__PURE__ */ jsx(MenuIcon, { "aria-hidden": "true" })
            ] }),
            /* @__PURE__ */ jsx(SheetContent, { children: /* @__PURE__ */ jsx("div", { className: "mt-6 flow-root", children: /* @__PURE__ */ jsxs("div", { className: "-my-6 divide-y divide-gray-500/10", children: [
              /* @__PURE__ */ jsx("div", { className: "space-y-2 py-6", children: navigation.map((item) => /* @__PURE__ */ jsx(
                "a",
                {
                  href: item.href,
                  className: "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50",
                  children: item.name
                },
                item.name
              )) }),
              /* @__PURE__ */ jsx("div", { className: "py-6", children: /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#",
                  className: "-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50",
                  children: "Log in"
                }
              ) })
            ] }) }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "hidden lg:flex lg:gap-x-12", children: navigation.map((item) => /* @__PURE__ */ jsx(
            "a",
            {
              href: item.href,
              className: "text-sm font-semibold leading-6 text-gray-900",
              children: item.name
            },
            item.name
          )) }),
          /* @__PURE__ */ jsx("div", { className: "hidden lg:flex lg:flex-1 lg:justify-end", children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/auth",
              className: "text-sm font-semibold leading-6 text-gray-900 flex gap-1",
              children: [
                "Log in",
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: /* @__PURE__ */ jsx(ArrowRight, { className: "w-4" }) })
              ]
            }
          ) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "relative isolate px-6 pt-14 lg:px-8", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": "true",
          className: "absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80",
          children: /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
              },
              className: "relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-zinc-400 to-zinc-900 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-2xl py-32 sm:py-48 lg:py-56", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl", children: "Scan your competencies with CBAPro AI" }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg leading-8 text-gray-600", children: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-10 flex items-center justify-center gap-x-6", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/playground",
              className: "rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              children: "Get started"
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "#",
              className: "text-sm font-semibold leading-6 text-gray-900 flex gap-1",
              children: [
                "Learn more",
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: /* @__PURE__ */ jsx(ArrowRight, { className: "w-4" }) })
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": "true",
          className: "absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]",
          children: /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
              },
              className: "relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-zinc-400 to-zinc-900 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            }
          )
        }
      )
    ] })
  ] });
}

const route11 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Index,
  loader: loader$7
}, Symbol.toStringTag, { value: 'Module' }));

const loader$6 = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  await logout();
  return redirect$2("/auth/login", {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  });
};

const route12 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  loader: loader$6
}, Symbol.toStringTag, { value: 'Module' }));

function Mobile() {
  return /* @__PURE__ */ jsxs("div", { className: "h-screen flex flex-col gap-4 justify-center items-start text-sm text-zinc-500 p-8", children: [
    /* @__PURE__ */ jsx(Logo, { subtitle: true, vartical: true, className: "self-center" }),
    /* @__PURE__ */ jsx("br", {}),
    /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Dear friend!" }),
    /* @__PURE__ */ jsx("p", { children: "For better view and performance, please switch to Desktop device." })
  ] });
}

const route13 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Mobile
}, Symbol.toStringTag, { value: 'Module' }));

function Auth() {
  return /* @__PURE__ */ jsxs("div", { className: "w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]-", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto grid w-80 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "grid gap-2 justify-center mb-16", children: /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(Logo, { subtitle: true, vartical: true, title: "CBA Pro" }) }) }),
      /* @__PURE__ */ jsx(Outlet, {})
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "hidden bg-muted lg:block", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/auth-bg.jpg",
        alt: "Image",
        width: "1920",
        height: "1080",
        className: "h-full w-full object-cover dark:brightness-[0.2] dark:grayscale grayscale"
      }
    ) })
  ] });
}

const route14 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Auth
}, Symbol.toStringTag, { value: 'Module' }));

const openai = new OpenAI({
  ...(process.env.USE_OPENAI_PROXY &&
    process.env.NODE_ENV === "development" && {
      httpAgent: new HttpsProxyAgent(process.env.PROXY_URL),
    }),
});

// upload file to assistant's vector store
async function CREATE({ thread, file }) {
  const vectorStoreId = await getOrCreateVectorStore(thread);

  const file_ = await openai.files.create({
    file,
    purpose: "assistants",
  });

  await openai.vectorStores.files.create(
    vectorStoreId,
    {
      file_id: file_.id,
    }
  );

  // console.log(thread.id, vectorStoreId, file_.id, vectorStoreFile);
  return file_;
}

const getOrCreateVectorStore = async (thread) => {
  if (thread?.tool_resources?.file_search?.vector_store_ids?.length > 0) {
    console.log("files::", "thread has vector_store_ids");
    return thread.tool_resources.file_search.vector_store_ids[0];
  }

  console.log("files::", "create vectorStores for thread");
  const vectorStore = await openai.vectorStores.create({
    name: `Store for ${thread?.id}`,
  });

  await openai.beta.threads.update(thread?.id, {
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStore.id],
      },
    },
  });
  return vectorStore.id;
};

const ClassName = "Thread";

async function read$1({ user, purpose = purposes.chat, objectId }) {
  try {
    const query = new Parse.Query(ClassName);
    user && query.equalTo("user", user.objectId);
    !objectId && query.equalTo("purpose", purpose);
    !objectId && query.descending("createdAt");
    if (objectId)
      return await query.get(objectId, { sessionToken: user.sessionToken });
    return await query.find({ sessionToken: user.sessionToken });
  } catch (error) {
    console.log("thread.read", error.message);
    if (error.code === Parse.Error.INVALID_SESSION_TOKEN)
      return redirect$2("/logout");
  }
}

async function create$1(args, sessionToken) {
  try {
    const Thread = Parse.Object.extend(ClassName);
    const thread = new Thread();
    return await thread.save(args, { sessionToken });
  } catch (error) {
    console.log("thread.create", error.message);
  }
}

async function update(args, sessionToken) {
  try {
    const Thread = Parse.Object.extend(ClassName);
    const thread = new Thread();
    return await thread.save(args, { sessionToken });
  } catch (error) {
    console.log("thread.update", error.message);
  }
}

const purposes = {
  chat: "chat",
  score: "score",
};

async function loader$5() {
  console.log("files.loader");
  return redirect$2("/app");
}
async function action$3({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  const thread = session.get("thread");
  if (!user) return redirect$2("/auth/login");
  const formData = await request.formData();
  const file = formData.get("file");
  const file_ = await CREATE({ thread: thread?.thread, file });
  const thread_ = await openai.beta.threads.retrieve(thread.threadId);
  await update(
    {
      objectId: thread.objectId,
      thread: thread_
    },
    user.sessionToken
  );
  session.set("thread", { ...thread, ...{ thread: thread_ } });
  session.set("file", file_);
  return Response.json(file_, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}

const route15 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$3,
  loader: loader$5
}, Symbol.toStringTag, { value: 'Module' }));

const Class$1 = "Message";

async function read(user, thread, limit) {
  try {
    const query = new Parse.Query(Class$1);
    user && query.equalTo("user", user.objectId);
    thread && query.equalTo("thread", thread.objectId || thread.id);
    limit && query.limit(limit);
    query.descending("createdAt");
    return await query.find({ sessionToken: user.sessionToken });
  } catch (error) {
    console.log("message.read", error.message);
    if (error.code === Parse.Error.INVALID_SESSION_TOKEN)
      return redirect$2("/logout");
  }
}

async function create(arg, sessionToken) {
  try {
    const Message = Parse.Object.extend("Message");
    const message = new Message();
    return await message.save(arg, { sessionToken });
  } catch (error) {
    console.log("outcome.create", error.message);
  }
}

const roles = {
  system: "system",
  assistant: "assistant",
  user: "user",
};

async function updateUsage(user, thread, usage) {
  const $thread = await read$1({ user, objectId: thread.objectId });
  const threadUsage = $thread.get("usage");
  // console.log("usage.updateUsage:thread.usage", threadUsage);

  await update(
    {
      objectId: thread.objectId,
      usage: {
        count: (threadUsage?.count ?? 0) + 1,
        input: (threadUsage?.input ?? 0) + usage.input,
        output: (threadUsage?.output ?? 0) + usage.output,
        total: (threadUsage?.total ?? 0) + usage.total,
      },
    },
    user.sessionToken
  );

  const profile = await read$3(user);
  const profileUsage = profile.get("usage");

  await update$2(
    {
      objectId: profile.id,
      usage: {
        count: (profileUsage?.count ?? 0) + 1,
        input: (profileUsage?.input ?? 0) + usage.input,
        output: (profileUsage?.output ?? 0) + usage.output,
        total: (profileUsage?.total ?? 0) + usage.total,
      },
    },
    user.sessionToken
  );
}

async function sync(request) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  // const scoreThread = session.get("scoreThread");
  const { competencyItem, outcome } = await request.json();

  if (!outcome) return null;

  const outcomCount = outcome?.score?.count;
  if (outcomCount && outcomCount >= Number(vars.app.scoreRequestOutcomeLimit))
    return Response.json({
      error: {
        message: `Score request limit: ${vars.app.scoreRequestOutcomeLimit} times`,
      },
    });

  // const ScoreThread = scoreThread ?? (await getScoreThread(user));
  const scoreThread = await getScoreThread(user);

  // console.log("score.sync.scoreThread", scoreThread, ScoreThread);
  // if (!ScoreThread) return null;
  // if (!scoreThread) session.set("scoreThread", ScoreThread);

  const scoreCount = scoreThread?.usage?.count;
  if (scoreCount && scoreCount >= Number(vars.app.scoreRequestLimit))
    return Response.json({
      error: {
        message: `Score request limit: ${vars.app.scoreRequestLimit} times`,
      },
    });

  const score = await getScore({
    user,
    competencyItem,
    outcome,
    scoreThread,
  });
  if (!score) return null;

  return Response.json(
    score,
    !scoreThread
      ? {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        }
      : {}
  );
}

async function getScore({ user, competencyItem, outcome, scoreThread }) {
  let score,
    usage = null;
  const content = `[Competency ${competencyItem.competencyGroup.order}] - [${competencyItem.title}] - [${outcome.situation}] - [${outcome.action}] - [${outcome.outcome}]`;

  await openai.beta.threads.messages.create(scoreThread.threadId, {
    role: roles.user,
    content,
  });

  const run = await openai.beta.threads.runs.create(scoreThread.threadId, {
    assistant_id: vars.openai.scoreAssistantId,
    stream: true,
  });

  for await (const r of run) {
    console.log("score.getScore.run", r.event);
    if (r.event === "thread.message.completed")
      score = {
        count: outcome?.score?.count ? outcome.score.count + 1 : 1,
        result:
          Number(
            r.data.content[0].text.value
              .split("\nRealistic Rationale: ")[0]
              .split(" = ")[1]
          ) || 0,
        reason: r.data.content[0].text.value.split(
          "\nRealistic Rationale: "
        )[1],
      };

    if (r.event === "thread.run.completed") {
      const {
        prompt_tokens: input,
        completion_tokens: output,
        total_tokens: total,
      } = r.data.usage;

      usage = { input, output, total };
    }
  }

  await update$1(
    {
      objectId: outcome.objectId,
      score,
    },
    user.sessionToken
  );

  await updateUsage(user, scoreThread, usage);

  return score;
}

async function getScoreThread(user) {
  const purpose = purposes.score;
  const threads = await read$1({ user, purpose });

  console.log("score.getScoreThread.threads", threads.length);
  if (threads?.length)
    return {
      objectId: threads[0].id,
      threadId: threads[0].get("threadId"),
      usage: threads[0].get("usage"),
    };

  const thread = await openai.beta.threads.create({
    metadata: {
      user: user.objectId,
      purpose,
    },
  });
  console.log("score.getScoreThread.thread.create", thread.id);

  if (thread?.id) {
    const thread_ = await create$1(
      {
        user: getPointer(models.user, user.objectId),
        name: "Score thread",
        threadId: thread.id,
        thread,
        purpose,
      },
      user.sessionToken
    );

    return {
      objectId: thread_.id,
      threadId: thread.id,
      usage: thread_.get("usage"),
    };
  }

  return null;
}

async function loader$4() {
  return redirect$2("/app");
}

async function action$2({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) return redirect$2("/auth/login");

  console.log("score.action.user", user.objectId);
  return await sync(request);
}

const route16 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$2,
  loader: loader$4
}, Symbol.toStringTag, { value: 'Module' }));

const domain = vars.stripe.domain;

async function createCheckoutSession({ lookup_key }) {
  console.log("join.createCheckoutSession", lookup_key);
  const prices = await getPrices({ lookup_keys: [lookup_key] });

  const session = await stripe.checkout.sessions.create({
    customer: "cus_RyOIZqMTgO8CWQ",
    billing_address_collection: "auto",
    line_items: [
      {
        price: prices.data[0].id,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${domain}/join?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domain}/join?canceled=true`,
  });

  return Response.redirect(session.url);
}

async function createPortalSession({ session_id }) {
  console.log("join.createPortalSession", session_id);
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they're done
  // managing their billing with the portal.
  const returnUrl = domain;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  return Response.redirect(portalSession.url);
}

async function getPrices({ lookup_keys }) {
  const prices = await stripe.prices.list({
    lookup_keys,
    expand: ["data.product"],
  });
  console.log(prices?.data?.length);
  return prices;
}

async function action$1({ request }) {
  const query = new URL(request.url).searchParams;
  const type = query.get("type");
  const form = await request.formData();
  const { lookup_key, session_id, ...values } = Object.fromEntries(form);
  console.log("join.action", { type, lookup_key, session_id, values });
  if (type === "create-checkout-session")
    return await createCheckoutSession({ lookup_key });
  if (type === "create-portal-session")
    return await createPortalSession({ session_id });
  return null;
}
async function loader$3({ request }) {
  return redirect$1("/");
}
function Join() {
  let [message, setMessage] = useState("");
  let [success, setSuccess] = useState(false);
  let [sessionId, setSessionId] = useState("");
  const { prices } = useLoaderData();
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setSuccess(true);
      setSessionId(query.get("session_id"));
    }
    if (query.get("canceled")) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [sessionId]);
  if (!success && message === "") {
    return /* @__PURE__ */ jsx(ProductDisplay, { prices });
  } else if (success && sessionId !== "") {
    return /* @__PURE__ */ jsx(SuccessDisplay, { sessionId });
  } else {
    return /* @__PURE__ */ jsx(Message$1, { message });
  }
}
const ProductDisplay = ({ prices }) => {
  return /* @__PURE__ */ jsx("section", { className: "flex gap-4", children: prices?.map((price, i) => /* @__PURE__ */ jsx("form", { action: "?type=create-checkout-session", method: "POST", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
    /* @__PURE__ */ jsx("strong", { children: price.product.name }),
    /* @__PURE__ */ jsxs("span", { children: [
      price.currency?.toUpperCase(),
      " ",
      price.unit_amount
    ] }),
    price.product?.metadata && /* @__PURE__ */ jsx("div", { className: "grid gap-1 divide-y text-sm", children: Object.keys(price.product.metadata).map((item, j) => /* @__PURE__ */ jsxs("span", { children: [
      item,
      ": ",
      price.product.metadata[item]
    ] }, j)) }),
    /* @__PURE__ */ jsx("input", { type: "hidden", name: "lookup_key", value: price.lookup_key }),
    /* @__PURE__ */ jsx(Button, { type: "submit", children: "Checkout" })
  ] }) }, i)) });
};
const SuccessDisplay = ({ sessionId }) => {
  return /* @__PURE__ */ jsxs("section", { children: [
    /* @__PURE__ */ jsx("div", { className: "product Box-root", children: /* @__PURE__ */ jsx("div", { className: "description Box-root", children: /* @__PURE__ */ jsx("h3", { children: "Subscription to starter plan successful!" }) }) }),
    /* @__PURE__ */ jsxs("form", { action: "?type=create-portal-session", method: "POST", children: [
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "session_id", value: sessionId }),
      /* @__PURE__ */ jsx(Button, { type: "submit", children: "Manage your billing information" })
    ] })
  ] });
};
const Message$1 = ({ message }) => /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsx("p", { children: message }) });

const route17 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: Join,
  loader: loader$3
}, Symbol.toStringTag, { value: 'Module' }));

const initialState = {
  income: {},
  outcome: {
    steps: [],
    // [""]
    guides: null,
    // [0]
    situation: null,
    action: null,
    outcome: null,
    score: null
    // {count,result,reason}
  },
  input: {},
  output: {}
};
const AppContext = createContext();
function AppContextProvider({ children }) {
  const [state, setState] = useState(initialState);
  return /* @__PURE__ */ jsx(AppContext.Provider, { value: { state, setState }, children });
}
function useStore() {
  const { state, setState } = useContext(AppContext);
  const store = Object.keys(initialState).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: (key, value) => setState(
        produce((draft) => {
          key ? draft[curr][key] = value : draft[curr] = value;
        })
      )
    }),
    {}
  );
  return {
    state,
    setState,
    store
  };
}

const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRightIcon, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(DotFilledIcon, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;

const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, { ref, className: cn("border-b", className), ...props }));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(
        ChevronDownIcon,
        {
          className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
        }
      )
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

function NavUser({
  user = {
    name: "Reza K",
    email: "reza@cbapro.ca",
    avatar: "https://i.pravatar.cc/150?img=3"
  }
}) {
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Avatar, { className: "h-12 w-12 rounded-full cursor-pointer", children: [
      /* @__PURE__ */ jsx(AvatarImage, { src: user.avatar, alt: user.name }),
      /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-lg", children: "RK" })
    ] }) }),
    /* @__PURE__ */ jsxs(
      DropdownMenuContent,
      {
        className: "min-w-72 rounded-lg space-y-2",
        align: "end",
        sideOffset: 4,
        children: [
          /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "p-0 font-normal", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-1 py-1.5 text-left text-sm", children: [
            /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8 rounded-full", children: [
              /* @__PURE__ */ jsx(AvatarImage, { src: user.avatar, alt: user.name }),
              /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-lg", children: "CN" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
              /* @__PURE__ */ jsx("span", { className: "truncate font-semibold", children: user.name }),
              /* @__PURE__ */ jsx("span", { className: "truncate text-xs", children: user.email })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxs(DropdownMenuLabel, { className: "flex gap-2 justify-between items-center font-medium", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-4" }),
            /* @__PURE__ */ jsxs("span", { className: "grid flex-auto", children: [
              "Remind me",
              /* @__PURE__ */ jsx("small", { className: "text-zinc-400", children: "Continue Working alerts" })
            ] }),
            /* @__PURE__ */ jsx(Switch, {})
          ] }),
          /* @__PURE__ */ jsxs(Accordion, { type: "single", collapsible: true, className: "m-0", children: [
            /* @__PURE__ */ jsxs(AccordionItem, { value: "item-1", className: "group border-none", children: [
              /* @__PURE__ */ jsx(AccordionTrigger, { className: "p-0 hover:no-underline group-data-[state=open]:text-primary [&>svg]:absolute [&>svg]:right-4", children: /* @__PURE__ */ jsxs(DropdownMenuLabel, { className: "flex gap-2 justify-between items-center font-medium", children: [
                /* @__PURE__ */ jsx(User, { className: "w-4" }),
                /* @__PURE__ */ jsxs("span", { className: "grid", children: [
                  "My Account",
                  /* @__PURE__ */ jsx("small", { className: "text-zinc-400", children: "Account Settings" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs(AccordionContent, { children: [
                /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "pl-8", children: [
                  /* @__PURE__ */ jsx(UserPen, {}),
                  /* @__PURE__ */ jsxs("span", { className: "grid", children: [
                    "Edit Profile",
                    /* @__PURE__ */ jsx("small", { className: "text-zinc-400", children: "Update Profile info" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "pl-8", children: [
                  /* @__PURE__ */ jsx(BatteryCharging, {}),
                  /* @__PURE__ */ jsxs("span", { className: "grid", children: [
                    "Usage Overview",
                    /* @__PURE__ */ jsx("small", { className: "text-zinc-400", children: "Review Account usages" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(AccordionItem, { value: "item-2", className: "group border-none", children: [
              /* @__PURE__ */ jsx(AccordionTrigger, { className: "p-0 hover:no-underline group-data-[state=open]:text-primary [&>svg]:absolute [&>svg]:right-4", children: /* @__PURE__ */ jsxs(DropdownMenuLabel, { className: "flex gap-2 justify-between items-center font-medium", children: [
                /* @__PURE__ */ jsx(BadgeHelp, { className: "w-4" }),
                /* @__PURE__ */ jsxs("span", { className: "grid", children: [
                  "Contact Support Team",
                  /* @__PURE__ */ jsx("small", { className: "text-zinc-400", children: "24/7 Access Help Desk" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs(AccordionContent, { children: [
                /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "pl-8", children: [
                  /* @__PURE__ */ jsx(MessageSquareText, {}),
                  /* @__PURE__ */ jsxs("span", { className: "grid", children: [
                    "Live Chat",
                    /* @__PURE__ */ jsx("small", { className: "text-zinc-400", children: "Get in Touch whit our Support team" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "pl-8", children: [
                  /* @__PURE__ */ jsx(MessageSquareDot, {}),
                  /* @__PURE__ */ jsxs("span", { className: "grid", children: [
                    "Feature Request",
                    /* @__PURE__ */ jsx("small", { className: "text-zinc-400", children: "We will build what's missing" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "pl-8", children: [
                  /* @__PURE__ */ jsx(MessageSquareX, {}),
                  /* @__PURE__ */ jsxs("span", { className: "grid", children: [
                    "Report a Bug",
                    /* @__PURE__ */ jsx("small", { className: "text-zinc-400", children: "Something is Broken? Let us Know!" })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(DropdownMenuItem, { children: [
            /* @__PURE__ */ jsx(Glasses, {}),
            /* @__PURE__ */ jsxs("span", { className: "grid", children: [
              "Request for PEng Reviewer",
              /* @__PURE__ */ jsx("small", { className: "text-zinc-400", children: "Account Expert Advice" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsx("div", { className: "p-1", children: /* @__PURE__ */ jsx(Link, { to: "/logout", className: "w-full", children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "w-full !text-orange-500 border-orange-500 !bg-transparent",
              children: [
                /* @__PURE__ */ jsx(LogOut, {}),
                "Log out"
              ]
            }
          ) }) })
        ]
      }
    )
  ] });
}

async function loader$2({ request }) {
  return null;
}
function Test() {
  return /* @__PURE__ */ jsx(AppContextProvider, { children: /* @__PURE__ */ jsx("div", { className: "w-[400px] p-8", children: /* @__PURE__ */ jsx(NavUser, {}) }) });
}

const route18 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Test,
  loader: loader$2
}, Symbol.toStringTag, { value: 'Module' }));

function ChatProgress({ className, input = 0, outcomes }) {
  const [value, setValue] = useState(input);
  const [status, setStatus] = useState(statuses.notStarted);
  const competenciesLength = 34;
  useEffect(() => {
    if (outcomes.length) {
      const length = outcomes.filter(
        (outcome) => outcome.flag === "approved" && outcome?.score
      ).length;
      const value2 = Math.round(100 / competenciesLength * length);
      setValue(value2);
    }
  }, [outcomes]);
  useEffect(() => {
    if (value === 0) return setStatus(statuses.notStarted);
    if (value < 100) return setStatus(statuses.inProgress);
    return setStatus(statuses.done);
  }, [value]);
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm text-zinc-400", children: "Total progress" }),
      /* @__PURE__ */ jsx(
        Progress,
        {
          value,
          className: cn(className, status.progressClassname)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsx(ProgressStatus, { status: statuses.notStarted }),
      /* @__PURE__ */ jsx(ProgressStatus, { status: statuses.inProgress }),
      /* @__PURE__ */ jsx(ProgressStatus, { status: statuses.done })
    ] })
  ] });
}
const ProgressStatus = ({ status = statuses.notStarted }) => /* @__PURE__ */ jsx("div", { className: "flex justify-between", children: /* @__PURE__ */ jsxs("div", { className: `flex gap-1 items-center text-xs ${status.className}`, children: [
  /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full" }),
  /* @__PURE__ */ jsx("span", { children: status.label })
] }) });
const statuses = {
  notStarted: {
    className: "text-zinc-500 [&>span:first-child]:bg-zinc-500",
    progressClassname: "bg-zinc-500/20 [&>div]:bg-zinc-500",
    label: "Not Started"
  },
  inProgress: {
    className: "text-blue-500 [&>span:first-child]:bg-blue-500",
    progressClassname: "bg-primary/20 [&>div]:bg-primary",
    label: "In Progress"
  },
  done: {
    className: "text-green-500 [&>span:first-child]:bg-green-500",
    progressClassname: "bg-green-500/20 [&>div]:bg-green-500",
    label: "Done"
  }
};

function Play({ ...props }) {
  return /* @__PURE__ */ jsx(
    Button,
    {
      variant: "default",
      size: "icon",
      className: cn(
        "rounded-full w-6 h-6 text-xs peer-hover:scale-110 transition",
        props?.className
      ),
      onClick: props?.onClick,
      children: /* @__PURE__ */ jsx(Play$1, { size: 4 })
    }
  );
}

function ChatIncome({ competencies, outcomes, getCompetency }) {
  function getClassName(ci) {
    const outcome = outcomes?.find(
      (item) => item.competency.objectId === ci.objectId
    );
    return outcome ? flags$1[outcome.flag].className : "";
  }
  function onClick(type, cg, ci) {
    getCompetency?.(type, cg, ci);
  }
  return /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, children: competencies.map((cg, x) => /* @__PURE__ */ jsxs(
    AccordionItem,
    {
      value: cg.objectId,
      className: "border-none group",
      children: [
        /* @__PURE__ */ jsxs(AccordionTrigger, { className: "hover:no-underline border border-zinc-200 group-data-[state=open]:border-primary group-data-[state=open]:text-primary rounded-lg p-3 my-1", children: [
          cg.order,
          ". ",
          cg.title
        ] }),
        /* @__PURE__ */ jsx(AccordionContent, { className: "space-y-1", children: cg.items.map((ci, y) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: cn(
                "peer pb-4 border rounded-md p-2 text-xs text-zinc-500 hover:bg-primary/5 hover:bg-opacity-50 transition text-left",
                getClassName(ci)
              ),
              onClick: () => onClick("send", cg, ci),
              children: [
                cg.order,
                ".",
                ci.order,
                " ",
                ci.title
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Play,
            {
              className: "absolute right-1 bottom-1 bg-zinc-400",
              onClick: () => onClick("run", cg, ci)
            }
          )
        ] }, y)) })
      ]
    },
    x
  )) });
}
const flags$1 = {
  idle: {
    title: "Idle",
    className: "border-zinc-500 text-zinc-700 [&+button]:bg-zinc-500"
  },
  pending: {
    title: "Pending",
    className: "border-blue-500 text-blue-500 [&+button]:bg-blue-500"
  },
  approved: {
    title: "Approved",
    className: "border-green-500 text-green-500 [&+button]:bg-green-500"
  }
};

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300",
  {
    variants: {
      variant: {
        default: "border-transparent bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/80 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80",
        secondary: "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
        destructive: "border-transparent bg-red-500 text-zinc-50 shadow hover:bg-red-500/80 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/80",
        outline: "text-zinc-950 dark:text-zinc-50"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  ...props
}) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}

function useOutcome() {
  const { state, store } = useStore();
  function initSteps(data) {
    const $steps = Object.keys(steps$1).filter((step) => {
      if (step === steps$1.guides.id && data?.guides?.length === guides.length)
        return step;
      if (step === steps$1.sao.id && data?.situation && data?.action && data?.outcome)
        return step;
      if (step === steps$1.score.id && data?.score) return step;
    });
    store.outcome("steps", $steps);
  }
  function syncSteps(condition, step) {
    let v = null;
    if (condition) {
      v = state.outcome.steps?.includes(step) ? state.outcome.steps : [...state.outcome.steps, step];
    } else {
      v = state.outcome.steps?.includes(step) ? state.outcome.steps.filter((s) => s !== step) : state.outcome.steps;
    }
    v && store.outcome("steps", v);
  }
  return {
    initSteps,
    syncSteps
  };
}

function Guides({ ...props }) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const { state, store } = useStore();
  const { syncSteps } = useOutcome();
  useEffect(() => {
    store.outcome("guides", null);
    setValue(null);
  }, [props?.outcome]);
  useEffect(() => {
    if (!value) {
      const v = props?.value ?? [];
      store.outcome("guides", v);
      setValue(v);
    }
    if (value?.length > 0) {
      syncSteps(value.length === guides.length, props?.step);
    }
  }, [value, props?.value]);
  async function onUpdate(v) {
    setLoading(true);
    const res = await fetch("/outcomes/update", {
      method: "POST",
      body: JSON.stringify({
        objectId: props?.outcome.objectId,
        guides: v
      })
    });
    if (!res?.error) {
      await props?.getOutcomes();
    }
    setLoading(false);
  }
  return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: !props?.competencyItem ? /* @__PURE__ */ jsx("div", { className: "text-yellow-700 text-xs text-center", children: "Select a Competency from Left panel to begin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "text-yellow-700 text-xs", children: [
      /* @__PURE__ */ jsx("b", { children: "Hint:" }),
      " Mark the checkbox upon completion to go forward."
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4 text-xs", children: value && guides.map((item, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "flex gap-2",
          !value?.includes?.(index) && !value?.includes?.(index - 1) && "opacity-50"
        ),
        children: [
          loading ? /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx(
            LoaderCircle,
            {
              size: 16,
              className: "animate-spin text-zinc-500"
            }
          ) }) : /* @__PURE__ */ jsx(
            Checkbox,
            {
              id: `chkbx-${index}`,
              disabled: index === 0 || value?.includes?.(index - 1) ? false : true,
              checked: value?.[index] === index ? true : false,
              onCheckedChange: (checked) => {
                const v = checked ? [...value, index] : value.filter((l) => l !== index && l < index);
                store.outcome("guides", v);
                setValue(v);
                onUpdate(v);
              }
            }
          ),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: cn(
                "space-y-1",
                value?.includes?.(index) && "text-primary- line-through",
                index === value.length && "text-primary"
              ),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: `chkbx-${index}`, children: item.title }),
                  item?.button && item.button.com(props?.sendChat)
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: item.description })
              ]
            }
          )
        ]
      },
      index
    )) })
  ] }) });
}
const guides = [
  {
    title: "Select a Competency",
    description: "Choose a competency from the left panel to start working on it."
  },
  {
    title: "Provide Your Best Answer",
    description: "Type out your response with as much detail as you remember. Don't worry if it's not perfect-AI will help refine it"
  },
  {
    title: "Review AI's Draft Carefully",
    description: "AI will generate a draft based on your input. Read it carefully to ensure it reflects your real experience."
  },
  {
    title: "Fix Any Mistakes",
    description: "If anything looks incorrect or unrealistic, edit the response before proceeding."
  },
  {
    title: "Click Evaluate & Improve",
    description: "The AI will analyze your response, identify missing details, and suggest improvements for better clarity.",
    button: {
      separate: true,
      label: "Evaluate & Improve",
      com: (sendChat) => Play({
        className: "-mt-1.5",
        onClick: () => sendChat("Is this convincing enough for the PEng assessor")
      })
    }
  },
  {
    title: "Add Missing Information",
    description: "AI will highlight gaps in your response. Provide the missing details in the chat to make your submission stronger."
  }
];

function SAO({ ...props }) {
  const { state } = useStore();
  const { syncSteps } = useOutcome();
  useEffect(() => {
    if (props?.outcome?.flag)
      syncSteps(props.outcome.flag === flags.approved, props?.step);
  }, [props?.outcome]);
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col space-y-8", children: !state?.outcome?.steps?.includes("guides") ? /* @__PURE__ */ jsx("div", { className: "text-yellow-700 text-xs text-center", children: "Complete previous step to continue" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "text-yellow-700 text-xs", children: [
      /* @__PURE__ */ jsx("b", { children: "Hint:" }),
      " Fill the following fields from chat results."
    ] }),
    props?.competencyItem && Object.keys(types).map((type, index) => /* @__PURE__ */ jsx(
      OutcomeBox,
      {
        type,
        label: types[type].label,
        limit: types[type].limit,
        competencyGroup: props?.competencyGroup,
        competencyItem: props.competencyItem,
        outcomes: props?.outcomes,
        outcome: props?.outcome,
        getOutcomes: props?.getOutcomes,
        step: props?.step
      },
      index
    ))
  ] }) });
}
function OutcomeBox({
  type,
  label,
  limit,
  competencyGroup,
  competencyItem,
  outcomes,
  outcome,
  getOutcomes,
  ...props
}) {
  const [updated, setUpdated] = useState(true);
  const [value, setValue] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const contentRef = useRef();
  const { syncSteps } = useOutcome();
  useEffect(() => {
    if (value) return setCounter(value.length);
    setCounter(0);
  }, [value]);
  useEffect(() => {
    setUpdated(true);
    setValue(outcome?.[type]);
    setPreviousValue(outcome?.[type]);
  }, [outcome]);
  function syncFlag(type2, value2) {
    outcome[type2] = value2;
    const SOA = [outcome?.situation, outcome?.action, outcome?.outcome];
    const idled = SOA.every((item) => !item || item === "");
    const filled = SOA.every((item) => item && item !== "");
    return idled ? "idle" : filled ? "approved" : "pending";
  }
  async function onUpdate() {
    if (!updated && counter > limit) return;
    if (!updated) {
      setLoading(true);
      const flag = syncFlag(type, value);
      const res = await fetch("/outcomes/update", {
        method: "POST",
        body: JSON.stringify({
          objectId: outcome.objectId,
          [type]: value,
          flag
        })
      });
      if (res?.error) return;
      syncSteps(flag === flags.approved, props?.step);
      await getOutcomes();
      setPreviousValue(value);
      setLoading(false);
    }
    setUpdated(!updated);
  }
  function onClose() {
    setValue(previousValue);
    setUpdated(!updated);
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-1 items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: label }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "text-[10px]",
              counter > limit ? "text-red-500" : "text-green-500",
              counter === 0 && "text-zinc-500"
            ),
            children: `(${counter} of ${limit})`
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
        loading && /* @__PURE__ */ jsx(LoaderCircle, { size: 12, className: "animate-spin" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            className: cn(
              "h-4 p-1 rounded-md text-xs",
              updated ? "text-blue-500" : "text-orange-500"
            ),
            onClick: onUpdate,
            children: updated ? "Edit" : "Save"
          }
        ),
        !updated && /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "w-4 h-4 mr-4",
            onClick: onClose,
            children: /* @__PURE__ */ jsx(X, {})
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Separator, {}),
    updated ? /* @__PURE__ */ jsx("div", { ref: contentRef, className: "text-zinc-400 text-sm", children: value }) : /* @__PURE__ */ jsx(
      Textarea,
      {
        className: cn(
          "min-h-40 bg-none focus-visible:ring-0 border-zinc/50 focus-visible:border-primary text-primary",
          `h-[${contentRef?.current?.clientHeight}px]`
        ),
        defaultValue: value,
        onKeyUp: (e) => setValue(e.target.value)
      }
    )
  ] });
}
const types = {
  situation: {
    label: "Situation",
    limit: 300
  },
  action: {
    label: "Action taken",
    limit: 1650
  },
  outcome: {
    label: "Outcome",
    limit: 300
  }
};
const flags = {
  idle: "idle",
  pending: "pending",
  approved: "approved"
};

function Score({
  competencyItem,
  outcome,
  getOutcomes,
  ...props
}) {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const { toast } = useToast();
  const { state } = useStore();
  const { syncSteps } = useOutcome();
  useEffect(() => {
    if (outcome?.score) syncSteps(outcome.score !== null, props?.step);
  }, [props?.outcome]);
  useEffect(() => {
    setScore(
      outcome?.score ?? {
        count: 0,
        result: 0,
        reason: null
      }
    );
  }, [outcome]);
  async function onClick() {
    setLoading(true);
    const res = await fetch("/score", {
      method: "POST",
      body: JSON.stringify({ competencyItem, outcome })
    });
    const data = await res.json();
    if (data?.error) {
      toast({
        title: data.error?.message ?? "Error!"
      });
      setLoading(false);
      return;
    }
    await getOutcomes();
    setLoading(false);
  }
  return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: !state?.outcome?.steps?.includes("sao") ? /* @__PURE__ */ jsx("div", { className: "text-yellow-700 text-xs text-center", children: "Complete previous step to continue" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "text-yellow-700 text-xs", children: [
      /* @__PURE__ */ jsx("b", { children: "Hint:" }),
      " Click the Button to get the Right Score for this Competency."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx(
        SubmitField,
        {
          type: "button",
          label: "Get Score",
          size: "small",
          className: "px-2 py-1",
          disabled: loading ? true : outcome?.flag !== "approved",
          loader: loading,
          onClick
        }
      ),
      /* @__PURE__ */ jsxs("span", { children: [
        "Result:",
        /* @__PURE__ */ jsxs("b", { className: "text-lg text-primary", children: [
          " ",
          `${score?.result}`
        ] })
      ] })
    ] }),
    score?.reason && /* @__PURE__ */ jsx("div", { className: "text-xs", children: /* @__PURE__ */ jsx(
      Markdown,
      {
        children: score.reason?.replace(/\\n/gi, "\n"),
        className: "text-zinc-600 [&_p]:mb-4 last:[&_p]:m-0 [&_li]:mb-4 [&_hr]:mb-4"
      }
    ) })
  ] }) });
}

const data = [
	{
		competency: "1.1",
		title: "Environmental Engineering - PEO",
		situation: "This situation demonstrates my understanding of the OBC, OFC, ANSI and ASC. I was responsible for estimating and value engineering, ensuring that the hardware and doors in a long-term care home building met the minimum requirements stipulated by the Ontario Building Code.",
		action: "I was involved in the writing of the hardware schedule and preparing options for value engineering.\n This includes:\n - I notified the consultant about errors and inconsistencies in door specifications, advocating for necessary corrections.\n - I collaborated with an Architectural Hardware Consultant to create the hardware schedule in compliance with OBC and ASC standards.\n - I estimated costs for wood/steel doors, and hardware.\n - I developed various cost-saving alternatives for the client's consideration.\n - I prepared the drawings and specifications for the tender documents.\n - I created shop drawings for all doors, including those with custom designs.\n - I was responsible for designing the doors, windows and hardware of the building to adhere to the regulations outlined in the Ontario Fire Code.\n - I was responsible for doing back checks and correction of the shop drawings.",
		outcome: "I handled estimation, value engineering, writing hardware schedule, and shop drawings, presenting the client with cost-saving options they ultimately chose, resulting in significant savings. The client expressed satisfaction with the provided cost-saving solutions."
	},
	{
		competency: "1.2",
		title: "Environmental Engineering - PEO",
		situation: "I was involved in a project that the owner had some budget issues, and they were trying to lower their expenses. The project was to build xxx",
		action: "I had multiple meetings with the project managers and clients, and I recommended a couple of options to ensure the high quality of the work is fulfilled, while I lessen the costs. My instructions are included below: \n - I suggested they should use an alternative product from a different manufacturer for the exit devices (exit device is mechanical door hardware operated from the inside of an out-swing exit door). I kept the grade of the exit device and its finish the same to meet the requirements of the specs.\n - I suggested they should use \"\"End Matched\"\" instead of \"\"Book Matched\"\" wood doors. Book Matched is one of the priciest matches of the woods because of its nature.\n They presented the architect with both of these ideas, and they were accepted. We move forward by giving them a credit change order.\n ",
		outcome: "The applied suggestions to the existing buildings helped lower their costs, therefore the client was happy with the project's results."
	},
	{
		competency: "1.3",
		title: "Environmental Engineering - PEO",
		situation: "At XYZ company, I served as project management support for delivery of planning, design and construction of municipal infrastructure and building projects in Manitoba. Project management service involves risk management which includes identifying and responding to project-specific risks at different phases of each\n project.",
		action: "• For each project, I met with the project team to review project objectives and establish the scope. I worked with the project lead to produce design services RFP with detailed and well defined scope of work. As an example at the planning stage of the project XYZ, I suggested to include implementation\n of zebra mussel control/mitigation system in the scope of work for the design consultant. As another example, during the planning stage of the ABCD Renovation project, I worked with the project team and developed design-stage scope of work to conduct a thorough inspection/condition assessment of the building. Based on findings of the inspection, we established scope of the construction. I also, engaged a consultant to conduct hazardous\n material inspection and identify areas affected by mould and mould remediation preclusions and requirements.\n • I produced and maintained budget tracking spreadsheet for each project. I worked with project lead and updated the budget tracker with any potential changes. For each change, I conducted budget impact assessment and provided recommendations for budgetary decisions to project team.\n • I worked with the project lead and conducted regular/monthly schedule analyses and forecasting. When there was schedule delays, we worked with the project team to plan for the remainder of the project and mitigate risks associated with the delays.",
		outcome: "• At ABCD company, for each project, potential risks were successfully identified at each stage of the project, risk impact were determined, solutions were assessed and\n recommendations were provided.\n • I gained valuable experience in risk management, including project-specific potential risk identification and finding strategies to avoid or mitigate risks."
	},
	{
		competency: "1.4",
		title: "Environmental Engineering - EGM",
		situation: "I was involved in a project to design door, frame and hardware for a public washroom. The client reported that previous washrooms were being very cold during winter time, so they requested the doors to be insulated.",
		action: "After examining the existing doors, I figured doors are steel stiffened filled with polystyrene. So they were already insulated by polystyrene, and in standard practice, they should not been conducting much heat. After assessing the situation, and doing calculations regarding the thermal conductivity coefficient  and how much heat is transferred through the steel stiffeners. I noticed the issue is caused by steel stiffeners. I suggested they should omit the steel stiffeners and keep the polystyrene, also for durability purposes I advised to increases the gauge of the doors. My responsibilities on this project were:\n - I was the primary point of contact with the client, and explained the issues to the client regarding the thermal conductivity issues.\n - I estimated the job including the engineering cost, material, and labour.\n - I was in contact with distributors to resolve the client's issue and requested them to do R-value tests (the R-value is the building industry term for thermal resistance per unit area) for doors with steel stiffeners filled with Polystyrene. The standard test was conducted by manufacturers for doors with either steel stiffened or Polystyrene filled, I proposed to manufacturer to conduct a unique test  to find R-value of a door which consists of both materials.\n - I prepared technical specification for doors with the gauge and core they want\n - I designed and drew the elevations for their openings.\n ",
		outcome: "It was a great accomplishment for me to define and propose a new set of test to find R-value of a specific type of door. The objective of test was fulfilled, as the client was happy with the outcome."
	},
	{
		competency: "1.5",
		title: "Environmental Engineering - PEO",
		situation: "The project included design and construction of an Access Road for XYZ client in Manitoba. For this project, I was tasked with the design calculation\n and development of design drawings and specifications and construction contract administration.",
		action: "1. I worked with the design team on developing the preliminary design using available background and arial images.\n 2. I coordinated with the filed surveyor and produced the existing topography in AutoCAD.\n 3. For the design, I created volume surfaces in Civil 3D and estimated cut-and-fill volumes.\n 4. During the construction, I reviewed contractor's shop drawings and materials testing results.\n 5. I used survey data collected at different stages of construction to assess cut-and-fill and granular materials quantities.",
		outcome: "1. Using the estimated earthworks quantities, construction cost estimate was produced.\n 2. The estimated volumes were used in tender forms, as well as, in the construction contract.\n The quantity analysis during the construction provided the actual volumes of earthwork and was based for progress and certification of payments to the\n contractor."
	},
	{
		competency: "1.6",
		title: "Environmental Engineering - EGM",
		situation: "A comprehensive site inspection was essential due to the involvement of diverse disciplines. Anticipating and mitigating all potential hazards before our team's visit was imperative. This required meticulous preparation of a Risk Assessment and Safety Plan to ensure utmost safety and preparedness.",
		action: "It was essential to anticipate and take measures to mitigate all potential hazards and safety risks ahead of our site visit according to Canada Occupational  Health and Safety Regulations. In facilitating our team's site visit, I arranged a comprehensive work plan comprising the following elements:\n - I developed a Job Hazard Assessment table, attentively assessing hazards, their likelihood, consequences, and corresponding controls.\n - Compilation of a detailed report delineating the impact of site visit on the surrounding community, train operations, and roadway infrastructure.\n - I appointed a competent supervisor to oversee the site visit.\n - I prepared the reports outlining access points to the job site, parking areas, and muster points.\n - I provided the directions to the nearest hospital.\n - I formulated a site-specific emergency plan encompassing emergency contact information, evacuation procedures, medical protocols, and other pertinent details.\n ",
		outcome: "I assured that our team of 15, consisting of inspectors from utility, structural, environmental, geo-engineering, grounding and bonding, cable containment, and track, visited the site over two days without encountering any safety issues."
	},
	{
		competency: "1.7",
		title: "Environmental Engineering - PEO",
		situation: "",
		action: "",
		outcome: ""
	},
	{
		competency: "1.8",
		title: "Environmental Engineering - PEO",
		situation: "",
		action: "",
		outcome: ""
	},
	{
		competency: "1.9",
		title: "Environmental Engineering - PEO",
		situation: "Under the supervision of the project lead, I served as Project Manager for the delivery of the planning, design and construction of the XYZ Water Treatment\n Plant (WTP) project in Manitoba",
		action: "1. I reviewed the feasibility study and met with the project team to validate the project scope and establish project requirements\n 2. I created and maintained (throughout the project) GANTT schedule and financial tracking forms throughout the project\n 3. I reviewed design consultant's proposed work plan, methodology, schedule and cost, and oversight of the design development process\n 4. I reviewed design consultant's field investigations plans and processes such as geotech investigation and water sampling/testing\n I reviewed design documents such as filed investigation reports, technical memo, preliminary design report, design drawings and specs and provided\n recommendation to owner\n 5.\n 6. I worked with the design consultant to review treatment technology/equipment selection process\n 7. I reviewed design consultant's reports/submissions for regulatory approvals such as ISC's Land Status and Environmental Review requirements\n 8. I reviewed Tender and Construction Contract documents prepared by the design consultant\n 9. I conducted monthly construction site visits and chaired construction progress review meetings\n 10. I reviewed proposed construction changes and conducted schedule and budget impact assessment and recommendation\n 11. I reviewed construction progress payment certificates and recommended payment",
		outcome: "1. Project’s needs were identified, and project scope was established\n 2. Project’s scope management was successfully achieved\n 3. Project’s cost and schedule monitoring and control were successfully achieved\n 4. I gained additional skills in review and quality control of projects from planning to design and construction"
	},
	{
		competency: "1.10",
		title: "Environmental Engineering - EGM",
		situation: "While engaged in the project, I served as a reviewer and observed a discrepancy  xxxxx",
		action: "Upon reviewing pertinent documents, I communicated to the disciplines the accurate milepost and emphasized the importance of alignment with it because the intention of the design was that all of the disciplines must have covered a certain mileage. Consequently, they revised their drawings to ensure consistency before submitting them for client review. Finally, I prepared an internal lessons learned report for the benefit of our team to make sure we will implement this experience to avoid any inconsistency happening in mileposts in future submissions.",
		outcome: "The outcome was a cohesive set of drawings where the milepost was accurate and consistent across all disciplines, and we received no critical comments from the client."
	},
	{
		competency: "2.1",
		title: "Environmental Engineering - EGM",
		situation: "As a project coordinator for a large-scale infrastructure project, my responsibilities include scheduling meetings with various disciplines and ensuring timely completion of assigned tasks. This position requires effective communication with the team, clients and stakeholders.",
		action: "",
		outcome: ""
	},
	{
		competency: "",
		title: "In this project, my role involves continuous verbal communication with the team for various tasks, including:\n - Managing deliverables, including their creation, cancellation, or adjustment, ensuring clarity on titles, drawing numbers, milestones, and platforms like BIM360 or ProjectWise.\n - Collaborating with senior project managers, project controls, designers, and clients to establish processes, work plans, consultant staff lists, and reports.\n - Facilitating meetings with clients, external stakeholders, and the project team, coordinating schedules, and participating actively in the discussions to make sure the whole team is on the same page.\n - Preparing and distributing meeting materials and minutes, ensuring comprehensive documentation.\n - Monitoring and following up on meeting action items to ensure completion.\n - Assisting the resource team in creating and presenting a concise presentation at Queen's University to introduce opportunities and challenges in the rail and transit industry to Civil Eng. students. It was an interactive session, and I talked about the project I am involved in and the challenges I face through my position.",
		situation: "I scheduled weekly discipline-specific meetings and team-wide meetings to enhance communication among team members. Both the client and team provided positive feedback on the effectiveness of these meetings. ",
		action: "",
		outcome: ""
	},
	{
		competency: "2.2",
		title: "Environmental Engineering - PEO",
		situation: "I served as a Design Engineer for the delivery of the following Feasibility Studies in Manitoba (in English!)",
		action: "• I contributed in preparing proposals by writing technical and non-technical sections of ODK's proposals\n • I met with the project team (owner, funding agent and other disciplines) took meeting notes and wrote meeting minutes/summary notes.\n • I reviewed the existing drawings, reports and available data and made summary notes\n • I conducted field review/inspection took notes and pictures and prepared report on the existing conditions\n • I conducted data analysis and prepared tables and charts for data presentation and wrote detailed discussion of the results\n I presented my design calculations (e.g. population projection, water demand, wastewater/waste production, systems sizing) in tables and wrote detailed\n description of the calculation methods and final results\n •\n • I wrote request for proposal/quote for services delivered by others such as water/wastewater equipment, geotech and soil/water/wastewater testing\n • I wrote regular status update emails to the owner/client and funding agency at each stage of the project\n • I prepared drawings for existing conditions and figures/diagram/drawings for proposed options\n • I prepared unit price table to estimate capital and O&M cost of selected options\n I created Tables/charts in MS Excel, prepared and formatted reports/memos in MS Word, created presentations in MS PowerPoint, and created and compiled\n reports in Adobe Acrobat",
		outcome: "• The clients and funding agents reviewed the reports and provided comments\n • l responded to the review comments and implemented them in to reports\n • The final report was prepared based on the review comments and the client and funding agent were satisficed\n • I received positive feedback from my manager and supervisor"
	},
	{
		competency: "2.3",
		title: "Environmental Engineering - PEO",
		situation: "As a member of ABDC project management team, I served for the delivery of the various municipal infrastructure and building projects in Manitoba. This role requires\n reviewing and understanding technical documents and providing briefings to the client.",
		action: "• I reviewed the project’s Terms of Reference (TOR) for the project management services\n • I reviewed background information such as the feasibility study report and as-built drawings\n • I provided review project approval request document and provided comments to the project officer at Indigenous Services Canada (ISC)\n • I reviewed the project requirements, prepared TOR for design consulting services, administered the call for proposals and answered proponent’s questions\n • As part of the evaluation committee, I reviewed the technical proposals for design consultant services and provided scoring and comments\n I reviewed Indigenous Services Canada’s guidelines/requirements for professional service contract with first nation communities - Namely CN-2 and prepared\n professional service contracts\n •\n • I reviewed design consultant’s submissions such as, condition assessment report, technical memoranda, preliminary design report and provided comments\n • I reviewed drawings and specifications developed by the design consultant and provided comments\n • I reviewed construction tender/contract documents developed by the design consultant and provided comments\n I reviewed professional service scope changes and construction proposed change notices (PCN) and provided comments/recommendation to the project\n table\n •\n • I reviewed weekly/monthly construction progress reports prepared by design consultant",
		outcome: "• On behalf of the clients, technical review and comments were provided on different technical documents\n • All the tasks that required review of technical documents were successfully performed\n • I received positive feedback from the clients and other project stakeholders"
	},
	{
		competency: "3.1",
		title: "Environmental Engineering - EGM",
		situation: "I provided a project estimate in 2020, and we were awarded the project in 2021 amidst the COVID-19 pandemic. As we commenced work, I realized that our company would incur financial losses due to the impact of the pandemic.",
		action: "I considered delays from material distributors and supply chain disruptions, along with increases in labour, gas, and material prices. Given our unit price contract, I filed a change order to address the impacts of COVID-19. I had a meeting with the project manager of the client and provided a detailed breakdown of the costs, leading to their approval of the proposed change order.",
		outcome: "Through careful planning and strategic decision-making, I was able to prevent financial losses for our company."
	},
	{
		competency: "3.2",
		title: "Environmental Engineering - EGM",
		situation: "As my professional journey advances, I have actively expanded my skill set, assumed greater responsibilities, and enhanced project deliverables across various roles and assignments.",
		action: "I have consistently demonstrated increasing levels of responsibility in project planning and implementation throughout my career. Initially, I was involved in fundamental tasks such as more basic calculations, design support, and drafting. As I gained experience, I transitioned to providing time estimates and fixed-price quotes to project managers, showcasing my ability to handle more complex responsibilities. Subsequently, I expanded my role to include preparing specs and estimating larger projects, indicating my growing proficiency in project management.\n Currently, as a member of the project management team, I am actively involved in coordinating various project activities under the guidance of senior project managers. In this capacity, I contribute to the planning and execution of projects by overseeing timelines/schedules, resources, and deliverables.\n During a recent project submission, I identified an error in track alignment. Recognizing the critical impact of this issue on the project, I promptly notified the relevant disciplines whose work was dependent on track alignment. Through effective communication and collaboration, they were able to rectify the error in a timely manner, ensuring the project remained on track.\n ",
		outcome: "My contribution was integral to the functioning of our engineering services practice. Across different roles within the company, I took on growing responsibilities, enhancing my comprehension of the professional engineer's role."
	},
	{
		competency: "3.3",
		title: "Environmental Engineering - EGM",
		situation: "My contribution was integral to the functioning of our engineering services practice. Across different roles within the company, I took on growing responsibilities, enhancing my comprehension of the professional engineer's role.",
		action: "The contract was based on unit prices, but unfortunately, the construction schedule experienced significant extensions. Concurrently, the costs associated with labour, materials, and fuel surged considerably. I was responsible for the estimating and doing the shop drawing for this project.\n I communicated with the client’s project manager regarding the impact of the extended schedule on our operations. To substantiate my concerns, I followed these steps:\n -I assessed the project timeline, comparing the original schedule with the current extended one. \n - I conducted a comprehensive analysis of the escalating costs. This involved tracking the rising prices of labour, materials, and fuel. By presenting these cost implications, I emphasized the financial strain caused by the prolonged schedule. Also, I anticipated the price increase we may face during the next 6 months bases on fluctuation in market.\n -I  documented the delays, cost fluctuations, and their cumulative effect on the project. This documentation served as evidence to support our case when communicating with the client.\n As part of the mitigation process, they agreed to authorize the difference between my original quotation and the adjusted cost based on updated prices by approving the change order I have issued.\n We also met the updated deadline.",
		outcome: "The successful completion of this project represents a significant personal achievement. I proactively identified potential challenges that could arise during the project’s life cycle, allowing me to mitigate schedule extensions and control additional costs effectively. \n "
	},
	{
		competency: "3.4",
		title: "Environmental Engineering - EGM",
		situation: "I provided estimates for doors, frames, and hardware for xxxxx",
		action: "I oversaw the financial aspects of this project, my responsibilities included:\n - Request for information in case I noticed any discrepancies in specs versus OBC requirements or if there was any inconsistencies in architectural drawings and needs corrections/clarifications.\n - Conducting detailed cost estimations for doors, frames, hardware, and installation.\n - Offering innovative cost-saving solutions to the client without compromising quality.\n - Assessing and analyzing tender bids, offering valuable feedback, and making recommendations.\n - Efficiently managing and attentively tracking construction changes via change orders to maintain financial integrity and project transparency.\n - Given our unit price contract, I filed a change order to address the impacts of COVID-19.\n ",
		outcome: "The project was successfully completed, and I gained valuable knowledge regarding the financial and budgeting aspects of the projects."
	},
	{
		competency: "3.5",
		title: "Environmental Engineering - EGM",
		situation: "On a project I helped the architect beyond the scope with preparing specifications for wood doors, as they did not have sufficient knowledge about the specs of the wood doors. I procured multiple corner samples featuring various finishes and plastic laminate for assessment by the interior designer.",
		action: "I facilitated a meeting with the contractor and the interior designer to assess the samples. While they approved the option for exterior doors, they expressed dissatisfaction with my proposal for interior doors. After evaluating alternatives, I presented additional options, noting their higher costs and the potential need for a change order to accommodate the difference. Upon receiving approval from both the interior designer and contractor, I proceeded to finalize the design and tender documents.",
		outcome: "The participation of the interior designer in the decision-making process provided a remarkable help with selecting the option which fit the requirements of the client perfectly."
	},
	{
		competency: "4.1",
		title: "Environmental Engineering - EGM",
		situation: "I contributed to a project focused on designing for the rail and transit industry. To ensure timely completion, collaboration within an interdisciplinary team including tracks, utility, environmental, structural, cable containment, and geo-engineering disciplines was essential.",
		action: "In my role as a project coordinator, I upheld respectful collaboration with both internal and external stakeholders, fostering cooperation and diplomacy throughout the team. We engaged in discussions to determine the most efficient routes aligning with our schedules and workloads. The design reviews were conducted in tandem with the client, ensuring a harmonious workflow. Through mutual cooperation, we ensured that no aspect of the work was rushed, working collaboratively to gather information and meet project deadlines.",
		outcome: "The project was successfully delivered within the designated timeline and budget constraints. The client expressed satisfaction with the outcome. I find that my productivity increases in an environment where respect is prioritized."
	},
	{
		competency: "4.2",
		title: "Environmental Engineering - PEO",
		situation: "I participated in a business development project aimed at promoting our company's growth. Collaborating with colleagues from diverse roles, our objective was to introduce our company and team to inspire students to join us.",
		action: "",
		outcome: ""
	},
	{
		competency: "5.1",
		title: "Environmental Engineering - EGM",
		situation: "Our track team expressed the need to conduct an on-site inspection of the tracks/rails, which was not initially included in the primary site visit plan. ",
		action: "I upheld the principles of the Code of Ethics within the Canadian engineering environment by communicating openly with stakeholders and prioritizing the delivery of a safe and reliable product over meeting unrealistic deadlines. Despite pressure to expedite the site visit due to its dependency on the designers' work, I prioritized the safety of the public and colleagues. I revised the Work Plan to include the hazards of walking on the tracks and our strategies for hazard control, resulting in a delayed site visit but ensuring its safety. I believe my measures were aligned with professional engineers obligations.",
		outcome: "Through my efforts, I ensured that public safety standards were met and the client's satisfaction was achieved."
	},
	{
		competency: "5.2",
		title: "Environmental Engineering - EGM",
		situation: "Upon commencing the development of the Package Management Template for deliverables, I recognized my limitations and pro-actively sought clarification through asking questions to ensure the completeness of my work. My responsibilities included creating and updating stubs for various disciplines.",
		action: "To ensure the accuracy and consistency of deliverable titles and numbers with the project overview I sought assistance from the design manager. After incorporating their input and clarifying any uncertainties, including the xxxx",
		outcome: "Following review by the Document Control team, the work was completed without receiving any comments regarding the accuracy of the deliverable titles and numbers. This indicates that they were deemed accurate and met the required standards moving forward."
	},
	{
		competency: "5.3",
		title: "Environmental Engineering - EGM",
		situation: "I received an invitation to attend a seminar sponsored by a prominent hardware distributor. During the event, the distributor provided dinner for all participants.",
		action: "I maintained regular communication with hardware distributors to remain updated on the latest technology, providing clients with diverse options. Attending the Door and Hardware Institute seminar broadened my understanding across various product lines. Using this knowledge, I integrated products from distributor which was sponsor of the program into hardware schedules while ensuring adding equivalent alternatives from other manufacturers to prevent conflicts of interest. Prioritizing client satisfaction, I provided multiple recommendations and welcomed client-submitted product reviews to optimize their choices.",
		outcome: "In this scenario, the project was successfully completed to the client's contentment, incorporating products from the sponsoring distributor as well as other sources."
	},
	{
		competency: "5.4",
		title: "Environmental Engineering - EGM",
		situation: "During the design phase of an irrigation and drainage network project, I encountered a challenge where the proposed layout conflicted with existing utility lines, complicating the implementation process and potentially leading to delays and cost overrun.",
		action: "To address this issue, I conducted a thorough review of the project area for further inspection, collaborating closely with utility providers to obtain accurate information about the location and depth of existing infrastructure. Using this data, I revised the design layout, optimizing the alignment of the irrigation and drainage network to minimize interference with utilities. ",
		outcome: "I accepted the professional responsibility of this issue, and by implementing the proper measure, I successfully resolved the conflict between the proposed irrigation and drainage network and existing utility lines, averting potential disruptions and costly setbacks."
	},
	{
		competency: "5.5",
		title: "Environmental Engineering - PEO",
		situation: "At ABCD Engineering, I was involved in the delivery of professional design services, as well as project management for delivery of design and construction of\n municipal infrastructure and building projects. For these I worked under supervision of a professional engineer (PEng) registered in Manitoba and they reviewed and stamped my works.",
		action: "I was involved in delivery of design services for water/wastewater servicing of new/expanded buildings for XYZ projects. I prepared design calculations, drawings and specifications. I double checked my work first then provided to the\n design lead for review. I provided revision/clarification if required and the final designs were sealed by the design lead. During the construction phase, I was\n responsible for construction contract administration. I reviewed contractors monthly progress claims and prepared progress payment certificates. I double\n checked my work and then provided to the design lead for review and seal.\n • I was also responsible for delivery of feasibility study reports for municipal component of School feasibility projects for ABCD project. I prepared the reports and submitted for review by the design lead. I provided revision/clarification if required and the final report were\n sealed by the design lead.\n • I also served as assistant project manager for delivery of design and construction of infrastructure projects including water supply and treatment facilities for\n XYZ projects. I prepared monthly financial reports. I double checked my work and\n then provided to the design lead for review and seal.",
		outcome: "• I gained knowledge and understanding of the process and procedure required when a professional engineer is signing and sealing documents prepared by\n others.\n • A good project delivery system was developed between me and the responsible PEng for preparing, double check, review, finalizing and seal professional\n works, and he was satisfied with my works."
	},
	{
		competency: "5.6",
		title: "Environmental Engineering - EGM",
		situation: "To excel in my professional endeavors, I recognize the significance of being self-aware regarding my strengths and weaknesses. Within my career development plan, I monitor self-evaluations to pinpoint areas that need improvement. Also, I delineate actionable steps aimed at enhancing my skills.",
		action: "I update my career development plan twice a year to assess my professional trajectory and identify areas for enhancement. Presently, my focus lies on several areas:\n - Increasing my proficiency in Building Information Modeling \n - I am planning to take courses regarding modeling in PCSWMM software\n - Strengthening my presentation skills for large-scale meetings.\n - I also took training courses regarding collaboration softwares like ProjecWise and BIM360\n ",
		outcome: "Completion of relevant courses has enriched my comprehension of collaboration tools and their effective utilization. Tracking my professional development plan has facilitated a structured approach to continual growth, enabling me to address any work-related deficiencies."
	},
	{
		competency: "6.1",
		title: "Environmental Engineering - PEO",
		situation: "When I was working on estimating and shop drawing of openings ABCD, it was imperative for the contractor to adhere to LEED requirements and to follow OFC. This ensured the promotion of sustainable building practices and facilitated efforts to address climate change.",
		action: "In this project, my primary role was to ensure adherence to LEED criteria by carefully selecting products that not only met sustainability standards but also aligned with project specifications. This entailed conducting a thorough analysis of technical product documentation to determine factors such as the percentage of recycled material and recyclability of the product. Additionally, I took into account the distance between the manufacturer and the job site to minimize transportation and reduce fuel emissions. Despite the limited options provided in the specifications, I successfully identified suitable manufacturers while meeting the required quality design aesthetics and, most importantly, fulfilling LEED criteria. Such adherence is pivotal in advancing sustainable development practices, mitigating climate change, and fostering resilience.\n In the design process of the doors and frames, I always ensured that fire codes such as fire-rating of the doors and frames, or the type of glass, and area of the windows or transoms were being followed because missing fire-rating of even a single door in shop drawings would cause not getting occupancy and could risk the public safety.\n ",
		outcome: ""
	},
	{
		competency: "LEED requirements were successfully fulfilled, resulting in a satisfied customer upon project completion. This project got occupancy without any issues.\"",
		title: "",
		situation: "",
		action: "",
		outcome: ""
	},
	{
		competency: "6.2",
		title: "Environmental Engineering - EGM",
		situation: "As part of my responsibilities for project ABCD, I coordinated and scheduled site walk-throughs/visits. Occasionally, inspectors may need to access areas close to the rail lines, potentially impacting public transportation routes.",
		action: "As a project coordinator who oversees the construction of a new rail and transit system, I understand the intrinsic link between engineering activities such as on-site inspection and the public. I prepared a thorough work plan report for the site visit including safety concerns to the inspectors and to the public and potential disruption to the public transportation. Through effective project management, I ensure that inspection progresses smoothly, minimizing disruptions to nearby residents and businesses. By coordinating with engineers and inspectors, I ensure that all aspects of the project, from safety measures to noise control, are carefully managed to prioritize the well-being and satisfaction of the local community. ",
		outcome: "Due to my commitment to public safety, the walk-through I organized proceeded smoothly, with no disruption to the public. Inspectors were able to conduct necessary measurements without incident."
	},
	{
		competency: "6.3",
		title: "Environmental Engineering - EGM",
		situation: "In my professional experience during project ABCD, I collaborated with practitioners from related fields whose work intersects with the area of professional engineering. Specifically, I regularly engaged with hardware consultants as part of my practice.",
		action: "When I was working with hardware consultants I understood the role and certification process of the AHC, Architectural Hardware Consultants, DHT, Door and Hardware Technician, EHC, Electrified Hardware Consultants qualifications granted by the trade members. Therefore, I understand the interface of various regulations in a single project and its importance of their role.\n I had the chance to work on different projects in Ontario and Quebec, which there are some specific differences in each building codes. For instance, I reviewed the shape and area of the push button/actuators for automatic door operators in design process, as each province required different dimension and shape. I respect the regional regulations in my practice.",
		outcome: "I prioritize building respectful relationships with colleagues, regulatory bodies, and utility representatives, fostering understanding of roles and regulations to collectively maintain safety in our work."
	},
	{
		competency: "6.4",
		title: "Environmental Engineering - EGM",
		situation: "A key part of my practice are projects such as ABDC, XYZ, etc. that include sustainability and energy saving measures accordingly.  During the process of developing shop drawings and cut sheets for openings of a project, I had to make sure all the material used was aligned with the LEED requirements.",
		action: "I prepared a report and supporting documents to show this project aligns with the LEED requirements and my design process ensured sustainable approach. My reports included:\n - List of all of the material used in the project for doors, frames and hardware\n - Showing recycling and recycled percentage of each material, and presenting supporting documents from the manufacturers\n - A comprehensive table to indicate the material versus the distance that the material will be freighted in interest of fuel consumption\n I have also read and tried to comply with the principles of national guideline on sustainable development and environmental stewardship for professional engineers.",
		outcome: "The outcome of the project was meeting the requirements and applicable codes and standards. I gained valuable information about Canada Green Building Council, and this project got Silver rating in LEED certification."
	},
	{
		competency: "6.5",
		title: "Environmental Engineering - EGM",
		situation: "I had a project for client ABCD to review and upgrade doors, frame and hardware of a student resident to renovate the building and improve accessibility based on the Accessibility for Ontarians with Disabilities Act, AODA.",
		action: "The primary objective was to design the doors and improve the hardware and accessibility of the building. After reviewing a few options, I presented an option that we could buy material from a manufacturer that was in Quebec, and we did not have to freight material overseas.\n I calculated the cost of material as well as the shipping and fuel expenses for two options, one from a Canadian and the other from a non-Canadian manufacturer. Based on my estimation, I found out that despite the cheaper price of the material from the non-Canadian company, I can reduce expenses when I take into account the shipping cost. By the sustainability analysis, I figured that I could lessen the carbon footprint significantly by ordering the material from a Canadian supplier.\n ",
		outcome: "When presenting my report to the client I promoted the benefits of fuel saving options, while we would meet the accessibility requirements specified by laws. The project was implemented and the client was happy."
	},
	{
		competency: "7.1",
		title: "Environmental Engineering - EGM",
		situation: "It is important for me to be aware of technical advancements and consistently identify areas necessitating further education to enhance my comprehension and effectively utilize this knowledge in my projects. Additionally, I actively engage in technical gatherings alongside DHI professionals.",
		action: "As part of my course I read several Door Hardware Institute, DHI, standards and guidelines as well as technical articles and manufacturer literature, and I participated in several courses such as below:\n - 40-hour in-person course - Electrified Architectural Hardware course, which includes brand new sections on battery backup configurations, step-by-step elevation drawings, new relay applications, as well as door position switches and how to use them correctly. \n - 24-hour in-person course - using codes and standards - which includes staying current and up-to-date on the ever-changing codes and standards requires both professional and personal commitment. This course covers NFPA 80, standard for fire doors and other opening protective (2013 edition), NFPA 101, Life Safety Code (2012 edition), ICC/ ANSI A117.1, Usable and Accessible Buildings and Facilities (2009 edition), and International Building Code (2015 edition). I learned the subjects below and applied them in designing:\n Tell the differences between codes and standards and how to interpret them.\n Implement the recent fire codes in designing the fire-rated openings.\n Determine requirements for means of egress openings.\n - I also had the chance to participate in PEO events and I am a government liaison program representative, and I met wonderful people during these events. I learned how to deliver PEO's messages to MPPs and other stakeholders.",
		outcome: "I have gained a better understanding of the recent advancements in the industry. I also shared my knowledge with my colleagues. I was able to identify and interpret codes and standards by taking these courses, and determine requirements for fire-rated openings."
	},
	{
		competency: "7.2",
		title: "Environmental Engineering - PEO",
		situation: "I understand that in order to develop professionally and advance my career, I am required to continually identify my weaknesses, as well as gaps in my knowledge\n and skills and create development strategy that focuses on my specific development needs.",
		action: "• At company ABCD, I started involvement in both design and project management services. I was was aware that despite to the technical skills I had previously gained in the field of civil/municipal/environmental engineering in my undergrad and grad studies, I still needed to improve my knowledge and skills in the engineering project delivery. As per my supervisor's  recommendation, I read a book on planning and execution of engineering projects titled “Project Delivery System”.\n • To be able to complete design tasks for the municipal projects, I read federal and provincial guidelines on design and implementation of infrastructure\n projects. Most of the resources were available in ODK’s library, but I did more research and found additional and more recent publications to read and\n updated the library.\n • The other important area that I needed education/training was administration and enforcement of construction contract during the bidding and construction\n phase of the projects. I read Canadian Construction Contracts Guide for CCDC2, as well as CN1 Contract Administration Training publication for Construction\n contracting for First Nation communities.",
		outcome: "I continually practiced training needs identification and improved my engineering and project management knowledge and skills by taking different courses and by\n researching and reading training guides and books."
	},
	{
		competency: "7.3",
		title: "Environmental Engineering - EGM",
		situation: "In my role as a project coordinator for project ABCD, I am required to possess a diverse skill set and expertise to effectively manage various projects to improve professional development. Our company has implemented a career development program along with annual goal-setting initiatives.",
		action: "I have structured my career development program alongside my annual goals, each assigned a weight out of 100. We regularly update the status of achieving these goals, reviewing and ranking them both personally and with our supervisors. This list undergoes annual updates, enabling me to track my progress and learning. Collaborating with my supervisor, I identify relevant areas for development aligned with my current and future work objectives. Subsequently, I set my yearly goals and search courses and opportunities to further my learning and apply newfound skills.\n I have already taken a few courses regarding the health and safety and have decided to take courses to get my PMP designation through a program that our company offers.\n ",
		outcome: "Following the assessment of this activity, I establish my annual goals and search relevant courses to undertake, along with upcoming opportunities to apply the new knowledge in my career."
	}
];
const cbas = {
	data: data
};

function Sample({ ...props }) {
  const [CBA, setCBA] = useState();
  useEffect(() => {
    const cba = cbas.data.find(
      (cba2) => cba2.competency === `${props?.competencyGroup.order}.${props?.competencyItem.order}`
    );
    setCBA(cba);
  }, [props?.competencyItem]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("strong", { className: "text-primary", children: CBA?.title }),
    /* @__PURE__ */ jsx("div", { className: "space-y-8", children: Object.keys(items).map((key, i) => /* @__PURE__ */ jsxs("div", { className: "divide-y space-y-1", children: [
      /* @__PURE__ */ jsxs("span", { className: "space-x-1", children: [
        /* @__PURE__ */ jsx("strong", { className: "font-semibold", children: items[key].title }),
        /* @__PURE__ */ jsxs("small", { className: "text-green-500", children: [
          "(",
          items[key].count,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-zinc-500 pt-1", children: /* @__PURE__ */ jsx(
        Markdown,
        {
          children: CBA?.[key]?.replace(/\\n/gi, "\n "),
          className: "space-y-2 [&>ul]:space-y-2 [&>ul]:list-[auto] [&>ul]:my-2 [&>ul]:pl-4 [&>ol]:list-[auto] [&>ol]:my-2 [&>ol]:pl-4"
        }
      ) })
    ] }, i)) })
  ] });
}
const items = {
  situation: {
    title: "Situation",
    content: "Content ...",
    count: "207 of 300"
  },
  action: {
    title: "Action taken",
    content: "Content ...",
    count: "925 of 1650"
  },
  outcome: {
    title: "Outcome",
    content: "Content ...",
    count: "267 of 300"
  }
};

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

function CollapsibleModule({ ...props }) {
  return /* @__PURE__ */ jsxs(
    Collapsible,
    {
      open: props?.open,
      defaultOpen: props?.defaultOpen,
      onOpenChange: props?.onOpenChange,
      className: cn(props?.className),
      disabled: props?.disabled,
      children: [
        /* @__PURE__ */ jsxs(CollapsibleTrigger, { className: cn(props?.triggerClassName), children: [
          props?.trigger,
          props?.icon
        ] }),
        /* @__PURE__ */ jsx(CollapsibleContent, { className: cn(props?.contentClassName), children: props?.content })
      ]
    }
  );
}

function Outcome({
  competencyGroup,
  competencyItem,
  outcomes,
  outcome,
  getOutcomes,
  sendChat,
  ...props
}) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(steps$1.guides.id);
  useStore();
  const { initSteps } = useOutcome();
  useEffect(() => {
    if (outcome) {
      initSteps(outcome);
      setData(outcome);
    }
  }, [outcome]);
  return /* @__PURE__ */ jsxs("div", { className: "h-full", children: [
    !competencyItem && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-4 text-xs text-zinc-500 mb-8", children: [
      /* @__PURE__ */ jsx(MousePointerClick, {}),
      "Select a Competency from Left panel"
    ] }),
    competencyItem && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-8 text-xs [&>div]:font-semibold [&>div]:text-primary", children: [
      /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "py-2", children: [
        competencyGroup?.order,
        ".",
        competencyGroup?.title
      ] }),
      /* @__PURE__ */ jsx(ChevronRight, { size: 16, className: "text-zinc-500" }),
      /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "py-2", children: [
        competencyGroup?.order,
        ".",
        competencyItem?.order
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Step$1,
      {
        trigger: steps$1.guides.title,
        content: /* @__PURE__ */ jsx(
          Guides,
          {
            step: steps$1.guides.id,
            value: data?.guides,
            competencyItem,
            outcome,
            getOutcomes,
            sendChat
          }
        ),
        step: steps$1.guides.id,
        open
      }
    ),
    /* @__PURE__ */ jsx(
      Step$1,
      {
        trigger: steps$1.sao.title,
        content: /* @__PURE__ */ jsx(
          SAO,
          {
            step: steps$1.sao.id,
            value: {
              situaction: data?.situaction,
              action: data?.action,
              outcome: data?.outcome
            },
            competencyGroup,
            competencyItem,
            outcomes,
            outcome,
            getOutcomes
          }
        ),
        step: steps$1.sao.id,
        open
      }
    ),
    /* @__PURE__ */ jsx(
      Step$1,
      {
        trigger: steps$1.score.title,
        content: /* @__PURE__ */ jsx(
          Score,
          {
            step: steps$1.score.id,
            value: data?.score,
            competencyItem,
            outcome,
            getOutcomes
          }
        ),
        step: steps$1.score.id,
        open
      }
    ),
    /* @__PURE__ */ jsx(
      Step$1,
      {
        trigger: steps$1.sample.title,
        content: /* @__PURE__ */ jsx(
          Sample,
          {
            step: steps$1.sample.id,
            competencyGroup,
            competencyItem
          }
        ),
        step: steps$1.sample.id,
        open
      }
    )
  ] });
}
function Step$1({ ...props }) {
  const { state } = useStore();
  return /* @__PURE__ */ jsx(
    CollapsibleModule,
    {
      trigger: props?.trigger,
      content: props?.content,
      defaultOpen: props.step === props.open,
      className: "group",
      triggerClassName: cn(
        "w-full flex justify-between text-left border rounded-lg p-3 my-1 text-[.85rem] border-zinc-200 group-data-[state=open]:border-primary group-data-[state=open]:text-primary",
        state.outcome.steps?.includes(props.step) && "!border-green-500 !text-green-500"
      ),
      contentClassName: "space-y-1 text-sm p-4 border border-zinc-200 rounded-lg",
      icon: /* @__PURE__ */ jsx(
        ChevronDown,
        {
          size: 16,
          className: "group-data-[state=open]:rotate-180 transition-transform text-zinc-400"
        }
      )
    }
  );
}
const steps$1 = {
  guides: {
    id: "guides",
    label: "Guides",
    title: "Step By Step Guide"
  },
  sao: {
    id: "sao",
    label: "SAO",
    title: "Structured Competency Writeups"
  },
  score: {
    id: "score",
    label: "Score",
    title: "Recommended Self-Assessment Score"
  },
  sample: {
    id: "sample",
    label: "Sample",
    title: "Approved Competency Examples"
  }
};

const suggestions = [
	{
		id: "1",
		title: "",
		description: "If you start categories 1, 5 and 6 at first, and get help from our AI, you will actually progress to 22 competencies, which is about 65% of the them. Finally, you can receive a special reward and 65 Scores!"
	},
	{
		id: "2",
		title: "",
		description: "Otherwise, If you start categories 2, 3, 4 and 7 at first, and get help from our AI, you will actually progress to 12 competencies, which is about 35% of the them. Finally, you can receive 35 Scores!"
	}
];

function Suggestions() {
  return /* @__PURE__ */ jsxs(Collapsible, { className: "relative z-10 text-sm flex-grow", children: [
    /* @__PURE__ */ jsxs(CollapsibleTrigger, { className: "bg-white w-full px-6 py-3 rounded-xl flex gap-2 justify-between items-center group text-zinc-600", children: [
      /* @__PURE__ */ jsx(Icon, {}),
      "Suggestions for Boosting your CBA",
      /* @__PURE__ */ jsx(
        ChevronDown,
        {
          size: 16,
          className: "ml-2 group-data-[state=open]:rotate-180 transition"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(CollapsibleContent, { className: "absolute mt-2 bg-white p-4 rounded-xl shadow-lg space-y-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-primary/75", children: "Quick suggestions" }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsx("ul", { className: "list-disc px-4 py-2 space-y-4 text-zinc-600", children: suggestions.map((suggestion, index) => /* @__PURE__ */ jsx("li", { children: suggestion.description }, index)) })
    ] })
  ] });
}
const Icon = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsx("rect", { width: "24", height: "24", fill: "#1E1E1E" }),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M-2577 -3864C-2577 -3919.23 -2532.23 -3964 -2477 -3964H2529C2584.23 -3964 2629 -3919.23 2629 -3864V8964C2629 9019.23 2584.23 9064 2529 9064H-2477C-2532.23 9064 -2577 9019.23 -2577 8964V-3864Z",
          fill: "#444444"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M-2477 -3963H2529V-3965H-2477V-3963ZM2628 -3864V8964H2630V-3864H2628ZM2529 9063H-2477V9065H2529V9063ZM-2576 8964V-3864H-2578V8964H-2576ZM-2477 9063C-2531.68 9063 -2576 9018.68 -2576 8964H-2578C-2578 9019.78 -2532.78 9065 -2477 9065V9063ZM2628 8964C2628 9018.68 2583.68 9063 2529 9063V9065C2584.78 9065 2630 9019.78 2630 8964H2628ZM2529 -3963C2583.68 -3963 2628 -3918.68 2628 -3864H2630C2630 -3919.78 2584.78 -3965 2529 -3965V-3963ZM-2477 -3965C-2532.78 -3965 -2578 -3919.78 -2578 -3864H-2576C-2576 -3918.68 -2531.68 -3963 -2477 -3963V-3965Z",
          fill: "white",
          fillOpacity: "0.1"
        }
      ),
      /* @__PURE__ */ jsx(
        "rect",
        {
          width: "1440",
          height: "1024",
          transform: "translate(-669 -38)",
          fill: "#F7F7F7"
        }
      ),
      /* @__PURE__ */ jsx("rect", { x: "-16", y: "-14", width: "348", height: "52", rx: "16", fill: "white" }),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M22 13V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H13",
          stroke: "#585858",
          strokeWidth: "1.2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M7.32996 14.49L9.70996 11.4C10.05 10.96 10.68 10.88 11.12 11.22L12.95 12.66C13.39 13 14.02 12.92 14.36 12.49L16.67 9.51001",
          stroke: "#585858",
          strokeWidth: "1.2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M19.48 15.8199L19.76 16.3899C19.9 16.6699 20.25 16.9299 20.56 16.9899L20.94 17.0499C22.08 17.2399 22.35 18.0799 21.53 18.9099L21.18 19.2599C20.95 19.4999 20.82 19.9599 20.89 20.2799L20.94 20.4899C21.25 21.8699 20.52 22.3999 19.32 21.6799L19.06 21.5299C18.75 21.3499 18.25 21.3499 17.94 21.5299L17.68 21.6799C16.47 22.4099 15.74 21.8699 16.06 20.4899L16.1099 20.2799C16.1799 19.9599 16.05 19.4999 15.82 19.2599L15.47 18.9099C14.65 18.0799 14.92 17.2399 16.06 17.0499L16.44 16.9899C16.74 16.9399 17.1 16.6699 17.24 16.3899L17.52 15.8199C18.06 14.7299 18.94 14.7299 19.48 15.8199Z",
          stroke: "#FDB900",
          strokeWidth: "1.2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    ]
  }
);

function UserAvatar({ className }) {
  return /* @__PURE__ */ jsxs(Avatar, { className: cn("rounded-xl", className), children: [
    /* @__PURE__ */ jsx(AvatarImage, { src: "https://i.pinimg.com/736x/fa/60/51/fa6051d72b821cb48a8cc71d3481dfef.jpg" }),
    /* @__PURE__ */ jsx(AvatarFallback, { children: "CN" })
  ] });
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(DropdownMenu, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { children: /* @__PURE__ */ jsx(UserAvatar, {}) }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { children: [
      /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "My Account" }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setOpen(false), children: /* @__PURE__ */ jsx(
        Link,
        {
          to: "/app/settings/overview",
          className: "w-full hover:text-primary",
          children: "Overview"
        }
      ) }),
      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setOpen(false), children: /* @__PURE__ */ jsx(
        Link,
        {
          to: "/app/settings/profile",
          className: "w-full hover:text-primary",
          children: "Profile"
        }
      ) }),
      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setOpen(false), children: /* @__PURE__ */ jsx(
        Link,
        {
          to: "/app/contact?type=help",
          className: "w-full hover:text-primary",
          children: "Request for Help"
        }
      ) }),
      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setOpen(false), children: /* @__PURE__ */ jsx(
        Link,
        {
          to: "/app/contact?type=reviewer",
          className: "w-full hover:text-primary",
          children: "Request for Reviewer"
        }
      ) }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsx(DropdownMenuItem, { children: /* @__PURE__ */ jsx(Link, { to: "/logout", className: "w-full hover:text-orange-500", children: "Logout" }) })
    ] })
  ] });
}

const ChatInput = forwardRef(function ChatInput({ getInput }, ref) {
  const [message, setMessage] = useState(null);
  const messageRef = useRef();
  async function onClick(value) {
    messageRef.current.value = "";
    getInput({ status: true, req: message ?? value });
    setMessage(null);
  }
  function onKeyUp(e) {
    const value = e.target.value;
    if (e.key == "Enter" && !e.shiftKey) {
      onClick();
    } else {
      setMessage(value);
    }
  }
  useImperativeHandle(ref, () => ({
    refresh: (value) => {
      messageRef.current.value = value;
      setMessage(value);
      onClick(value);
    }
  }));
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(
      Textarea,
      {
        rows: 1,
        variant: "ghost",
        placeholder: "Write a messge here ...",
        className: "border-none shadow-none focus-visible:ring-border-primary resize-none pr-8",
        ref: messageRef,
        onKeyUp
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "destructive",
        size: "icon",
        className: "rounded-full bg-zinc-300 hover:bg-primary w-8 h-8 absolute right-4 top-4",
        disabled: !message || message === "" ? true : false,
        onClick,
        children: /* @__PURE__ */ jsx(ArrowUp, {})
      }
    )
  ] });
});

function ChatSplash() {
  return /* @__PURE__ */ jsxs("div", { className: "absolute max-w-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid gap-4 text-zinc-400", children: [
    /* @__PURE__ */ jsx(Logo, { subtitle: true, vartical: true, animate: true }),
    /* @__PURE__ */ jsxs("div", { className: "grid- gap-4 *:flex *:gap-2 *:items-center text-xs hidden invisible", children: [
      /* @__PURE__ */ jsx("span", { children: "Explore key data to make informeddecisions" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Icon1, {}),
        "Visualize trends at a glance."
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Icon2, {}),
        "Customize your view to suit your needs."
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Icon3, {}),
        "Evaluate your CV to persue a specific career"
      ] })
    ] })
  ] });
}
const Icon1 = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    width: "20",
    height: "21",
    viewBox: "0 0 20 21",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: "w-6",
    children: [
      /* @__PURE__ */ jsx(
        "path",
        {
          opacity: "0.4",
          d: "M5.73328 15.524V13.799",
          stroke: "#3382F7",
          strokeWidth: "1.5",
          strokeLinecap: "round"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          opacity: "0.4",
          d: "M10 15.5239V12.0739",
          stroke: "#3382F7",
          strokeWidth: "1.5",
          strokeLinecap: "round"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          opacity: "0.4",
          d: "M14.2667 15.5239V10.3406",
          stroke: "#3382F7",
          strokeWidth: "1.5",
          strokeLinecap: "round"
        }
      ),
      /* @__PURE__ */ jsxs("g", { opacity: "0.4", children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M14.2666 5.27362L13.8833 5.72362C11.7583 8.20695 8.90828 9.96529 5.73328 10.757",
            stroke: "#3382F7",
            strokeWidth: "1.5",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M11.8254 5.27362H14.2671V7.70695",
            stroke: "#3382F7",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M7.49996 18.7323H12.5C16.6666 18.7323 18.3333 17.0656 18.3333 12.8989V7.89895C18.3333 3.73228 16.6666 2.06561 12.5 2.06561H7.49996C3.33329 2.06561 1.66663 3.73228 1.66663 7.89895V12.8989C1.66663 17.0656 3.33329 18.7323 7.49996 18.7323Z",
          stroke: "#3382F7",
          strokeWidth: "1.5",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    ]
  }
);
const Icon2 = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    width: "20",
    height: "21",
    viewBox: "0 0 20 21",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: "w-10",
    children: [
      /* @__PURE__ */ jsx(
        "path",
        {
          opacity: "0.34",
          d: "M10 12.8989C11.3807 12.8989 12.5 11.7796 12.5 10.3989C12.5 9.01821 11.3807 7.89893 10 7.89893C8.61929 7.89893 7.5 9.01821 7.5 10.3989C7.5 11.7796 8.61929 12.8989 10 12.8989Z",
          stroke: "#3382F7",
          strokeWidth: "1.5",
          strokeMiterlimit: "10",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M1.66663 11.1323V9.66562C1.66663 8.79895 2.37496 8.08229 3.24996 8.08229C4.75829 8.08229 5.37496 7.01562 4.61663 5.70729C4.18329 4.95729 4.44163 3.98229 5.19996 3.54895L6.64163 2.72395C7.29996 2.33229 8.14996 2.56562 8.54163 3.22395L8.63329 3.38229C9.38329 4.69062 10.6166 4.69062 11.375 3.38229L11.4666 3.22395C11.8583 2.56562 12.7083 2.33229 13.3666 2.72395L14.8083 3.54895C15.5666 3.98229 15.825 4.95729 15.3916 5.70729C14.6333 7.01562 15.25 8.08229 16.7583 8.08229C17.625 8.08229 18.3416 8.79062 18.3416 9.66562V11.1323C18.3416 11.999 17.6333 12.7156 16.7583 12.7156C15.25 12.7156 14.6333 13.7823 15.3916 15.0906C15.825 15.849 15.5666 16.8156 14.8083 17.249L13.3666 18.074C12.7083 18.4656 11.8583 18.2323 11.4666 17.574L11.375 17.4156C10.625 16.1073 9.39163 16.1073 8.63329 17.4156L8.54163 17.574C8.14996 18.2323 7.29996 18.4656 6.64163 18.074L5.19996 17.249C4.44163 16.8156 4.18329 15.8406 4.61663 15.0906C5.37496 13.7823 4.75829 12.7156 3.24996 12.7156C2.37496 12.7156 1.66663 11.999 1.66663 11.1323Z",
          stroke: "#3382F7",
          strokeWidth: "1.5",
          strokeMiterlimit: "10",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    ]
  }
);
const Icon3 = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    width: "20",
    height: "21",
    viewBox: "0 0 20 21",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: "w-10",
    children: [
      /* @__PURE__ */ jsx(
        "path",
        {
          opacity: "0.4",
          d: "M15.2667 10.3989C17.4333 10.3989 18.3333 9.5656 17.5333 6.83227C16.9917 4.9906 15.4083 3.40727 13.5667 2.8656C10.8333 2.0656 10 2.9656 10 5.13227V7.53227C10 9.5656 10.8333 10.3989 12.5 10.3989H15.2667Z",
          stroke: "#3382F7",
          strokeWidth: "1.5",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M16.6667 12.6489C15.8917 16.5073 12.1917 19.3073 7.98336 18.6239C4.82502 18.1156 2.28336 15.5739 1.76669 12.4156C1.09169 8.22393 3.87502 4.52393 7.71669 3.7406",
          stroke: "#3382F7",
          strokeWidth: "1.5",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    ]
  }
);

function Message({
  assistant = false,
  content,
  createdAt,
  current
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "message flex gap-4 items-start",
        !assistant && "flex-row-reverse"
      ),
      children: [
        assistant ? /* @__PURE__ */ jsx(Logo, {}) : /* @__PURE__ */ jsx(UserAvatar, { className: "size-8" }),
        /* @__PURE__ */ jsx(
          Markdown,
          {
            children: content?.replace(/\\n/gi, "\n"),
            className: cn(
              "markdown-content p-4 rounded-2xl text-sm max-w-[80%] text-zinc-600 [&_p]:mb-4 last:[&_p]:m-0 [&_li]:mb-4 [&_hr]:mb-4",
              assistant ? "bg-zinc-50" : "bg-primary/5"
            )
          }
        )
      ]
    }
  );
}

function ChatOutput({ messages, run, setRun }) {
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  useEffect(() => {
    if (run.status) {
      handleStream(run.req);
      setRun({ status: false, req: null });
      if (results !== "") {
        messages.push({
          objectId: (/* @__PURE__ */ new Date()).getTime(),
          createdAt: (/* @__PURE__ */ new Date()).toJSON(),
          role: "assistant",
          content: results
        });
        setResults("");
      }
      messages.push({
        objectId: (/* @__PURE__ */ new Date()).getTime(),
        createdAt: (/* @__PURE__ */ new Date()).toJSON(),
        role: "system",
        // content: [{ text: { value: formData?.get("message") } }],
        // content: formData?.get("message"),
        content: run.req
      });
      setLoading(true);
      scrollTo();
    }
  }, [run.status]);
  useEffect(() => {
    scrollTo(true);
  }, []);
  function handleStream(q) {
    const eventSource = new EventSource("/sse?q=" + q);
    eventSource.addEventListener("thread.message.delta", (event) => {
      setLoading(false);
      setResults((prev) => prev + event.data);
    });
    eventSource.addEventListener("thread.message.completed", (event) => {
      eventSource.close();
    });
    eventSource.addEventListener("error", (event) => {
      setLoading(false);
      console.log({ event });
      eventSource.close();
    });
  }
  function scrollTo(last = false) {
    const scrollbar = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    scrollbar.scrollTo(0, scrollbar?.scrollHeight + 1e3);
  }
  return /* @__PURE__ */ jsx(
    ScrollArea,
    {
      className: "relative w-full h-full [&>div>div]:h-full-",
      ref: scrollRef,
      children: /* @__PURE__ */ jsxs("div", { className: "h-0 space-y-4 pl-2", children: [
        messages?.length > 0 ? messages.map((message, index) => /* @__PURE__ */ jsx(
          Message,
          {
            assistant: message.role === "assistant",
            content: message.content,
            createdAt: message.createdAt,
            current: messages.length - 1 === index ? true : false
          },
          index
        )) : (
          // <Message
          //   assistant
          //   content="Welcome to CBAPro! type something to begin"
          //   createdAt={thread?.created_at}
          //   current={true}
          // />
          /* @__PURE__ */ jsx(ChatSplash, {})
        ),
        results !== "" && /* @__PURE__ */ jsx(
          Message,
          {
            assistant: true,
            content: results,
            createdAt: (/* @__PURE__ */ new Date()).toJSON(),
            current: true
          }
        ),
        loading && /* @__PURE__ */ jsx("div", { className: "pt-10 flex justify-center", children: /* @__PURE__ */ jsx(Logo, { animate: true, className: "grayscale opacity-50" }) }),
        /* @__PURE__ */ jsx("div", { className: "h-10" })
      ] })
    }
  );
}

function Assessment({ file, sendChat }) {
  const [afile, setAFile] = useState(file);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleFile = async (event) => {
    setLoading(true);
    const data = new FormData();
    if (event.target.files.length < 0) return;
    data.append("file", event.target.files[0]);
    const res = await fetch("/files", {
      method: "POST",
      body: data
    });
    const file2 = await res.json();
    setLoading(false);
    if (!file2.error) {
      setAFile(file2);
      setOpen(false);
      sendChat("My CV has been uploaded with the name " + file2?.filename);
      return;
    }
    console.log("assessment.handleFile", file2?.error);
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { children: /* @__PURE__ */ jsx(
      Button,
      {
        asChild: true,
        variant: "ghost",
        className: "shadow-none bg-primary/10 hover:bg-primary/10 text-primary rounded-lg p-6 gap-2",
        children: /* @__PURE__ */ jsxs("div", { children: [
          afile ? /* @__PURE__ */ jsx(Paperclip, {}) : /* @__PURE__ */ jsx(Plus, { size: 20 }),
          afile ? afile.filename : "New Assessment"
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "min-w-[48rem]", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Attach Your Resume (Word Format Only)" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: /* @__PURE__ */ jsxs("span", { className: "text-sm grid gap-2 mt-4", children: [
          /* @__PURE__ */ jsx("span", { children: "To ensure the best results from our CV parsing model, please download and use our recommended CV template." }),
          /* @__PURE__ */ jsx("span", { children: "Please ensure your ADDRESS and PHONE NUMBER is not provided in the the CV you upload." }),
          /* @__PURE__ */ jsxs("span", { className: "grid", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Step 1: ",
              "",
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "/template-cv.docx",
                  target: "_blank",
                  className: "text-primary",
                  children: "Download the CV Template"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("span", { children: "Step 2: Fill in your details using the template." }),
            /* @__PURE__ */ jsx("span", { children: "Step 3: Upload your updated CV in Word (.docx) format." })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "py-4", children: [
        afile && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { children: "You’ve already uploaded a file before. Do you want to REPLACE it?" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center text-primary", children: [
            /* @__PURE__ */ jsx(FileText, { size: "16" }),
            /* @__PURE__ */ jsx("small", { children: afile.filename })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-8", children: !loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              name: "file",
              type: "file",
              accept: ".doc,.docx",
              className: "min-h-10 p-[1px] cursor-pointer hover:border-primary transition hover:*:text-primary rounded-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100",
              onChange: handleFile
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "text-xs m-1 text-center text-primary", children: "Please upload your CV only in word file (doc, docx)." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "h-10 leading-10 text-sm text-center", children: "Wait ..." }) })
      ] })
    ] })
  ] });
}

async function init(session) {
  const user = session.get("user");
  let thread = session.get("thread");
  let file = session.get("file");

  if (thread) {
    console.log("chat.init", "current thread", thread.objectId, file?.id);
    return { thread, file };
  }

  const threads = await read$1({ user });
  console.log("chat.init", "all threads", threads.length);

  if (threads.length === 0) {
    const _thread = await openai.beta.threads.create();

    if (_thread.error) {
      console.log("chat.init", _thread.error.error);
      return { error: _thread.error.error };
    }

    const res = await create$1(
      {
        name: "Thread 1",
        threadId: _thread.id,
        user: getPointer(models.user, user.objectId),
        thread: _thread,
        purpose: purposes.chat,
      },
      user.sessionToken
    );
    thread = res.toJSON();

    console.log("chat.init", "add new thread", _thread?.id, thread?.objectId);
  } else {
    thread = threads[0].toJSON();
  }

  file = await getFile(thread?.thread);

  session.set("thread", thread);
  session.set("file", file);

  console.log("chat.init", "exist thread", thread.objectId, file?.id);
  return { thread, file };
}

async function getFile(thread) {
  let file;
  const vectorStoreId =
    thread?.tool_resources?.file_search?.vector_store_ids?.[0];
  if (vectorStoreId) {
    try {
      const files = await openai.vectorStores.files.list(vectorStoreId);
      if (files?.data.length > 0)
        file = await openai.files.retrieve(files.data[0].id);
    } catch (error) {
      console.log("chat.getFile", error);
    }
  }
  return file;
}

async function send({ user, thread, content }) {
  let req;

  try {
    req = await openai.beta.threads.messages.create(thread.threadId, {
      role: roles.user,
      content,
    });
    console.log("chat.send.req", req.id);
  } catch (error) {
    console.log("chat.send.req", error);
  }

  let additional_messages = null;
  const { additionalMessages } = vars.app;
  const limit = Number(additionalMessages);
  if (limit > 0) {
    const messages = await read(user, thread, limit);
    additional_messages = messages.reverse().map((m) => ({
      role: m.get("role"),
      content: m.get("content"),
    }));
    console.log("sse.send.additional_messages", additional_messages.length);
  }

  try {
    const stream = await openai.beta.threads.runs.create(thread.threadId, {
      assistant_id: vars.openai.assistantId,
      stream: true,
      additional_messages,
    });

    if (req && stream) return { req, stream };

    // for await (const stream of run) {
    //   if (stream.event === "thread.run.failed") {
    //     console.log("chat.send.run", stream.event);
    //     await openai.beta.threads.messages.del(thread.threadId, req.id);
    //   }

    //   // if (stream.event === "thread.message.delta")

    //   if (stream.event === "thread.message.completed") {
    //     res = stream.data;
    //     console.log(
    //       "chat.send.res",
    //       stream.event,
    //       stream.data.status,
    //       stream.data.id
    //     );
    //   }
    // }
  } catch (error) {
    console.log("chat.send.run", error);
  }
}

async function save({ user, thread, req, res }) {
  if (req?.id && res?.id) {
    await create(
      {
        user: getPointer(models.user, user.objectId),
        thread: getPointer(models.thread, thread.objectId),
        message: req,
        role: roles.user,
        content: req.content[0].text.value,
      },
      user.sessionToken
    );

    await create(
      {
        user: getPointer(models.user, user.objectId),
        thread: getPointer(models.thread, thread.objectId),
        message: res,
        role: roles.assistant,
        content: res.content[0].text.value,
      },
      user.sessionToken
    );

    return res;
  }
}

const Class = "Competency";

async function getAll() {
  try {
    const query = new Parse.Query(Class);
    query.include("competencyGroup");
    const data = await query.find();
    return modifier(data);
  } catch (error) {
    console.log("competency.getAll", error.message);
  }
}

function modifier(data) {
  return data.reduce((t, v) => {
    const cg = v.get("competencyGroup").toJSON();
    const g = t.find((i) => i.objectId === cg.objectId);
    !g ? t.push({ ...cg, items: [v] }) : g.items.push(v);
    return t;
  }, []);
}

const steps = [
	{
		step: 1,
		label: "Assessments",
		text: "You can create or switch Assessment and attach or replace your CV here. Then start the conversation.",
		pos: null
	},
	{
		step: 2,
		label: "Income",
		text: "You can choose any of these or another competency you wish to address from left side bar.",
		pos: null
	},
	{
		step: 3,
		label: "Outcom",
		text: "You can choose any of these or another competency you wish to address from left side bar.",
		pos: null
	},
	{
		step: 4,
		label: "Progress",
		text: "You can see your growth on the progress bar that introduce it into 3 states: Not Started, In Progress, Done.",
		pos: null
	},
	{
		step: 5,
		label: "Input",
		text: "Chat input ...",
		pos: null
	},
	{
		step: 6,
		label: "Output",
		text: "Chat output ...",
		pos: null
	}
];

function Guide() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(null);
  useEffect(() => {
    if (!localStorage.getItem("guide")) syncPos();
  }, []);
  function onSkip() {
    setOpen(false);
    localStorage.setItem("guide", false);
    document?.querySelector(`[data-guide-step="${step.step}"]`)?.setAttribute("style", "");
  }
  function onNext() {
    const next = step ? steps[steps.findIndex((s) => step.step === s.step) + 1] ?? steps[0] : steps[0];
    setStep(next);
    document?.querySelector(`[data-guide-step="${next?.step}"]`)?.setAttribute("style", "position: relative; z-index: 40;");
    step && document?.querySelector(`[data-guide-step="${step.step}"]`)?.setAttribute("style", "");
  }
  function syncPos() {
    const sw = 384;
    const sh = 128;
    const offset = 30;
    const SW = window?.innerWidth;
    const SH = window?.innerHeight;
    const hints = document?.querySelectorAll("[data-guide-step]");
    hints.forEach((hint) => {
      const step2 = Number(hint.getAttribute("data-guide-step"));
      const { x, y, width: w, height: h } = hint.getBoundingClientRect();
      const origin = { x: x + w / 2, y: y + h / 2 };
      const left = origin.x;
      const right = SW - origin.x;
      const top = origin.y;
      const bottom = SH - origin.y;
      const xCenter = origin.x - sw / 2;
      const yCenter = origin.y - sh / 2;
      const pos = {
        get x() {
          if (left > right) {
            if (left - w / 2 < sw + offset * 2) return xCenter;
            return x - sw - offset;
          }
          if (right - w / 2 < sw + offset * 2) return xCenter;
          return x + w + offset;
        },
        get y() {
          if (top > bottom) {
            if (top - h / 2 < sh + offset * 2) return yCenter;
            return y - sh - offset;
          }
          if (bottom - h / 2 < sh + offset * 2) return yCenter;
          return y + h + offset;
        }
      };
      steps.find((s) => s.step === step2)["pos"] = pos;
    });
    setOpen(true);
    onNext();
    localStorage.setItem("guide", true);
  }
  return /* @__PURE__ */ jsxs("div", { className: cn(open ? "block visible" : "hidden invisible"), children: [
    /* @__PURE__ */ jsx("div", { className: "fixed left-0 top-0 w-screen h-screen bg-white/80 z-30" }),
    step && /* @__PURE__ */ jsx(Step, { ...{ step, onSkip, onNext } })
  ] });
}
function Step({
  step: {
    step,
    label,
    text,
    pos: { x, y }
  },
  onSkip,
  onNext
}) {
  const [finish, setFinish] = useState(false);
  useEffect(() => {
    if (step && steps.findIndex((s) => step === s.step) + 1 === steps.length)
      setFinish(true);
  }, [step]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "absolute z-50 bg-white shadow-lg rounded-xl p-4 text-sm space-y-4 w-96"
      ),
      style: { left: x + "px", top: y + "px" },
      children: [
        /* @__PURE__ */ jsx("p", { className: "text-zinc-800", children: text }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-between itemes-end", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-zinc-500 place-self-end", children: [
            step,
            " of ",
            steps?.length
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "link",
                size: "small",
                className: "p-1 px-2",
                onClick: onSkip,
                children: "Skip"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "default",
                size: "small",
                className: "p-1 px-2",
                onClick: finish ? onSkip : onNext,
                children: finish ? "Finish" : "Next step"
              }
            )
          ] })
        ] })
      ]
    }
  );
}

const shouldRevalidate = ({
  currentParams,
  nextParams,
  currentUrl,
  nextUrl,
  defaultShouldRevalidate
}) => {
  return false;
};
async function loader$1({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) return redirect$2("/auth/login");
  console.log("app.loader.user", user.objectId);
  const { thread, file } = await init(session);
  if (!thread) console.log("app.loader.init", "thread not found!");
  console.log("app.loader.thread", thread.objectId);
  const messages = await read(user, thread);
  console.log("app.loader.messages", messages.length);
  const competencies = await getAll();
  console.log("app.loader.competencies", competencies.length);
  const outcomes = await read$2(user, thread);
  console.log("app.loader.outcomes", outcomes.length);
  const data = {
    thread,
    messages: messages.reverse(),
    file,
    competencies,
    outcomes_: outcomes
  };
  return Response.json(data, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}
async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  session.get("user");
  const thread = session.get("thread");
  const formData = await request.formData();
  const content = formData.get("message");
  console.log("app.action", thread.threadId, content);
  let stream = null;
  if (thread && content) {
    stream = await send(request);
  }
  return stream ?? null;
}
function App() {
  const { thread, messages, file, competencies, outcomes_ } = useLoaderData();
  const [competencyGroup, setCompetencyGroup] = useState(null);
  const [competencyItem, setCompetencyItem] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [outcomes, setOutcomes] = useState(outcomes_);
  const [run, setRun] = useState({ status: false, req: null });
  const inputRef = useRef(null);
  async function getCompetency(...income) {
    const [type, cg, ci] = income;
    if (type === "run") inputRef.current?.refresh(ci?.title);
    setCompetencyGroup(cg);
    setCompetencyItem(ci);
    let outcome2 = outcomes?.find(
      (item) => item.competency.objectId === ci.objectId
    );
    if (!outcome2) {
      console.log("!outcome");
      const res = await fetch("/outcomes/create", {
        method: "POST",
        body: JSON.stringify({
          competency: ci
        })
      });
      outcome2 = await res.json();
      await getOutcomes();
    }
    setOutcome(outcome2);
  }
  async function getInput({ status, req }) {
    setRun({ status, req });
  }
  async function getOutcomes() {
    const res = await fetch("/outcomes/get", { method: "POST" });
    const outcomes2 = await res.json();
    setOutcomes(outcomes2);
    const outcome_ = outcomes2.find(
      (item) => item.objectId === outcome?.objectId
    );
    setOutcome(outcome_);
  }
  function sendChat(text) {
    inputRef.current?.refresh(text);
  }
  return /* @__PURE__ */ jsx(AppContextProvider, { children: /* @__PURE__ */ jsxs("div", { className: "bg-[#F7F7F7] h-full flex gap-4 p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "w-72 bg-white rounded-xl", children: /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 p-4 divide-y [&>:last-child]:pt-4", children: [
        /* @__PURE__ */ jsx(Logo, { subtitle: true }),
        /* @__PURE__ */ jsx("div", { "data-guide-step": "4", children: /* @__PURE__ */ jsx(ChatProgress, { outcomes }) })
      ] }),
      /* @__PURE__ */ jsx(ScrollArea, { className: "flex-grow p-4", "data-guide-step": "2", children: /* @__PURE__ */ jsx(
        ChatIncome,
        {
          competencies,
          outcomes,
          getCompetency
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-grow flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-center", children: [
        /* @__PURE__ */ jsx("div", { "data-guide-step": "1", children: /* @__PURE__ */ jsx(Assessment, { file, sendChat }) }),
        /* @__PURE__ */ jsx(Suggestions, {}),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "https://www.youtube.com/playlist?list=PL6iszEhc4K7Xger5FMuMUrlmbDnzS0NSm",
            target: "_blank",
            className: "bg-white hover:bg-white hover:text-primary transition flex items-center text-zinc-600 gap-2 rounded-xl px-6 py-3 text-sm",
            children: [
              /* @__PURE__ */ jsx(Youtube, { className: "stroke-1" }),
              "How it works?",
              /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: "ml-4" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsx(Bell, {}) }),
          /* @__PURE__ */ jsx(Outlet, {}),
          /* @__PURE__ */ jsx(UserMenu, {})
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 flex-grow", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-grow w-0 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex-grow flex justify-center items-center bg-white p-4 rounded-xl",
              "data-guide-step": "6",
              children: /* @__PURE__ */ jsx(ChatOutput, { messages, run, setRun })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-zinc-400 text-center px-4", children: "Ensure all examples are truthful and based on your own professional experience-submitting false, emblished, or created work experience examples may lead to investigation and disciplinary action." }),
          /* @__PURE__ */ jsx("div", { className: "bg-white p-4 rounded-xl", "data-guide-step": "5", children: /* @__PURE__ */ jsx(ChatInput, { ref: inputRef, getInput }) })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-72 bg-white rounded-xl flex flex-col",
            "data-guide-step": "3",
            children: /* @__PURE__ */ jsx(ScrollArea, { className: "h-0 p-4 flex-grow [&>div>div]:h-full-", children: /* @__PURE__ */ jsx(
              Outcome,
              {
                competencyGroup,
                competencyItem,
                outcomes,
                outcome,
                getOutcomes,
                sendChat
              }
            ) })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Guide, {})
  ] }) });
}

const route19 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  action,
  default: App,
  loader: loader$1,
  shouldRevalidate
}, Symbol.toStringTag, { value: 'Module' }));

function eventStream(signal, init, options = {}) {
  let stream = new ReadableStream({
    start(controller) {
      let encoder = new TextEncoder();
      let closed = false;
      function send({ event = "message", data }) {
        if (closed) return; // If already closed, not enqueue anything
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        if (closed) return; // If already closed, not enqueue anything
        data.split("\n").forEach((line, index, array) => {
          if (closed) return; // If already closed, not enqueue anything
          let value = `data: ${line}\n`;
          if (index === array.length - 1) value += "\n";
          controller.enqueue(encoder.encode(value));
        });
      }
      init(send, close);
      function close() {
        if (closed) return;
        // cleanup();
        closed = true;
        signal.removeEventListener("abort", close);
        controller.close();
      }
      signal.addEventListener("abort", close);
      if (signal.aborted) return close();
    },
  });
  let headers = new Headers(options.headers);
  if (headers.has("Content-Type")) {
    console.warn("Overriding Content-Type header to `text/event-stream`");
  }
  if (headers.has("Cache-Control")) {
    console.warn("Overriding Cache-Control header to `no-cache`");
  }
  if (headers.has("Connection")) {
    console.warn("Overriding Connection header to `keep-alive`");
  }
  headers.set("Content-Type", "text/event-stream");
  headers.set("Cache-Control", "no-cache");
  headers.set("Connection", "keep-alive");
  return new Response(stream, { headers });
}

async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  const thread = session.get("thread");

  if (!user) return redirect("/auth/login");

  console.log("sse.loader.user", user.objectId);
  let content = new URL(request.url).searchParams.get("q");

  if (thread && content) {
    const { req, stream } = await send({ user, thread, content });

    return eventStream(request.signal, function setup(send, close) {
      async function run() {
        for await (const s of stream) {
          console.log("sse.loader.stream", s.event);

          if (s.event === "thread.run.failed") {
            close();
            return;
          }

          if (
            s.event === "thread.message.delta" ||
            s.event === "thread.message.completed"
          ) {
            send({
              event: s.event,
              data:
                s.event === "thread.message.delta"
                  ? s.data?.delta?.content?.[0]?.text?.value
                  : s.data?.content?.[0]?.text?.value,
            });
          }

          if (s.event === "thread.message.completed") {
            const res = s.data;
            await save({ user, thread, req, res });
          }

          if (s.event === "thread.run.completed") {
            close();

            const {
              prompt_tokens: input,
              completion_tokens: output,
              total_tokens: total,
            } = s.data.usage;

            await updateUsage(user, thread, { input, output, total });
          }
        }
      }
      run();
    });
  }

  return Response.json({});
}

const route20 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: 'Module' }));

const serverManifest = {'entry':{'module':'/assets/entry.client-CzHzQRDF.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/components-CX0sUFVy.js'],'css':[]},'routes':{'root':{'id':'root','parentId':undefined,'path':'','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/root-DExKJvnW.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/components-CX0sUFVy.js','/assets/use-toast-DYrZrp-R.js','/assets/react-icons.esm-rwe---N-.js','/assets/index-8C1TgZ4U.js','/assets/index-DKSfMDA3.js'],'css':[]},'routes/app.settings.overview':{'id':'routes/app.settings.overview','parentId':'routes/app.settings','path':'overview','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/app.settings.overview-CWu3NX4u.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/logo-ByS3sw0U.js','/assets/progress-B-OOUUU4.js','/assets/alert-CxUHx0Tb.js','/assets/button-CTur9RYT.js','/assets/index-8C1TgZ4U.js','/assets/components-CX0sUFVy.js','/assets/index-Bw096r3b.js'],'css':[]},'routes/app.settings.profile':{'id':'routes/app.settings.profile','parentId':'routes/app.settings','path':'profile','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/app.settings.profile-GAN-dthQ.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/button-CTur9RYT.js','/assets/index-8C1TgZ4U.js','/assets/loader-circle-DhGAlDXI.js','/assets/react-icons.esm-rwe---N-.js','/assets/components-CX0sUFVy.js','/assets/scroll-area-L3FUHWQ2.js','/assets/Combination-UUIhIHuY.js','/assets/index-Bw096r3b.js','/assets/index-DKSfMDA3.js','/assets/component-BNoCFiKk.js','/assets/floating-ui.react-dom-BG5e4N6P.js','/assets/index-CX1UruNB.js','/assets/index-DgbcTfU2.js','/assets/input-BcVCSBdC.js','/assets/submit-field-B0R-B0PH.js','/assets/use-toast-DYrZrp-R.js','/assets/index-Ch1Hn_2w.js','/assets/createLucideIcon-DrJDHJGQ.js','/assets/separator-BpOIB7rr.js'],'css':[]},'routes/_auth.auth.callback':{'id':'routes/_auth.auth.callback','parentId':'routes/_auth','path':'auth/callback','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_auth.auth.callback-B0xOLG2O.js','imports':['/assets/jsx-runtime-D2HyDbKh.js'],'css':[]},'routes/_auth.auth.consent':{'id':'routes/_auth.auth.consent','parentId':'routes/_auth','path':'auth/consent','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_auth.auth.consent-DEz4xp_m.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/input-CedBB6hn.js','/assets/checkbox-D-SfQNGd.js','/assets/submit-field-B0R-B0PH.js','/assets/components-CX0sUFVy.js','/assets/createLucideIcon-DrJDHJGQ.js','/assets/input-BcVCSBdC.js','/assets/index-8C1TgZ4U.js','/assets/loader-circle-DhGAlDXI.js','/assets/react-icons.esm-rwe---N-.js','/assets/index-DgbcTfU2.js','/assets/index-CX1UruNB.js','/assets/index-Ch1Hn_2w.js','/assets/button-CTur9RYT.js'],'css':[]},'routes/_auth.auth.login':{'id':'routes/_auth.auth.login','parentId':'routes/_auth','path':'auth/login','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_auth.auth.login-DJC6JO6Y.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/button-CTur9RYT.js','/assets/input-BcVCSBdC.js','/assets/loader-circle-DhGAlDXI.js','/assets/turnstile-BrDT1zVU.js','/assets/components-CX0sUFVy.js','/assets/index-8C1TgZ4U.js','/assets/createLucideIcon-DrJDHJGQ.js'],'css':[]},'routes/_auth.auth.reset':{'id':'routes/_auth.auth.reset','parentId':'routes/_auth','path':'auth/reset','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_auth.auth.reset-CRik6mDo.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/input-CedBB6hn.js','/assets/alert-CxUHx0Tb.js','/assets/index-8C1TgZ4U.js','/assets/createLucideIcon-DrJDHJGQ.js','/assets/submit-field-B0R-B0PH.js','/assets/turnstile-BrDT1zVU.js','/assets/components-CX0sUFVy.js','/assets/input-BcVCSBdC.js','/assets/loader-circle-DhGAlDXI.js','/assets/button-CTur9RYT.js'],'css':[]},'routes/outcomes.$action':{'id':'routes/outcomes.$action','parentId':'root','path':'outcomes/:action','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/outcomes._action-l0sNRNKZ.js','imports':[],'css':[]},'routes/app.settings':{'id':'routes/app.settings','parentId':'routes/app','path':'settings','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/app.settings-DaQ6i4dg.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/index-8C1TgZ4U.js','/assets/react-icons.esm-rwe---N-.js','/assets/dialog-DXOPFsfq.js','/assets/button-CTur9RYT.js','/assets/input-BcVCSBdC.js','/assets/separator-BpOIB7rr.js','/assets/sheet-BCrmqtr7.js','/assets/components-CX0sUFVy.js','/assets/index-DKSfMDA3.js','/assets/component-BNoCFiKk.js','/assets/floating-ui.react-dom-BG5e4N6P.js','/assets/index-CX1UruNB.js','/assets/createLucideIcon-DrJDHJGQ.js','/assets/user-DKdd1BuT.js','/assets/index-B8TYSf5L.js'],'css':[]},'routes/app.contact':{'id':'routes/app.contact','parentId':'routes/app','path':'contact','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/app.contact-CHunbkWb.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/dialog-DXOPFsfq.js','/assets/input-CedBB6hn.js','/assets/loader-circle-DhGAlDXI.js','/assets/textarea-CdWIYD1l.js','/assets/submit-field-B0R-B0PH.js','/assets/button-CTur9RYT.js','/assets/index-8C1TgZ4U.js','/assets/components-CX0sUFVy.js','/assets/index-B8TYSf5L.js','/assets/react-icons.esm-rwe---N-.js','/assets/component-BNoCFiKk.js','/assets/index-DKSfMDA3.js','/assets/input-BcVCSBdC.js','/assets/createLucideIcon-DrJDHJGQ.js'],'css':[]},'routes/join.cb':{'id':'routes/join.cb','parentId':'routes/join','path':'cb','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/join.cb-l0sNRNKZ.js','imports':[],'css':[]},'routes/_index':{'id':'routes/_index','parentId':'root','path':undefined,'index':true,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_index-C9OSsTPZ.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/sheet-BCrmqtr7.js','/assets/button-CTur9RYT.js','/assets/createLucideIcon-DrJDHJGQ.js','/assets/components-CX0sUFVy.js','/assets/arrow-right-C9SmgPxt.js','/assets/index-B8TYSf5L.js','/assets/react-icons.esm-rwe---N-.js','/assets/component-BNoCFiKk.js','/assets/index-DKSfMDA3.js','/assets/index-8C1TgZ4U.js'],'css':[]},'routes/logout':{'id':'routes/logout','parentId':'root','path':'logout','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/logout-l0sNRNKZ.js','imports':[],'css':[]},'routes/mobile':{'id':'routes/mobile','parentId':'root','path':'mobile','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/mobile-C-zbbgS5.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/logo-ByS3sw0U.js'],'css':[]},'routes/_auth':{'id':'routes/_auth','parentId':'root','path':undefined,'index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_auth-Df417TZO.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/logo-ByS3sw0U.js','/assets/components-CX0sUFVy.js'],'css':[]},'routes/files':{'id':'routes/files','parentId':'root','path':'files','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/files-l0sNRNKZ.js','imports':[],'css':[]},'routes/score':{'id':'routes/score','parentId':'root','path':'score','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/score-l0sNRNKZ.js','imports':[],'css':[]},'routes/join':{'id':'routes/join','parentId':'root','path':'join','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/join-CeC3s8uq.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/button-CTur9RYT.js','/assets/components-CX0sUFVy.js','/assets/index-8C1TgZ4U.js'],'css':[]},'routes/test':{'id':'routes/test','parentId':'root','path':'test','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/route-CZ6w_NVx.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/accordion-DSijrcwe.js','/assets/react-icons.esm-rwe---N-.js','/assets/index-DgbcTfU2.js','/assets/index-CX1UruNB.js','/assets/components-CX0sUFVy.js','/assets/index-8C1TgZ4U.js','/assets/button-CTur9RYT.js','/assets/createLucideIcon-DrJDHJGQ.js','/assets/user-DKdd1BuT.js','/assets/index-Bw096r3b.js','/assets/Combination-UUIhIHuY.js','/assets/component-BNoCFiKk.js','/assets/index-DKSfMDA3.js','/assets/floating-ui.react-dom-BG5e4N6P.js'],'css':[]},'routes/app':{'id':'routes/app','parentId':'root','path':'app','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/app-2V6j56XO.js','imports':['/assets/jsx-runtime-D2HyDbKh.js','/assets/logo-ByS3sw0U.js','/assets/progress-B-OOUUU4.js','/assets/index-8C1TgZ4U.js','/assets/accordion-DSijrcwe.js','/assets/button-CTur9RYT.js','/assets/createLucideIcon-DrJDHJGQ.js','/assets/checkbox-D-SfQNGd.js','/assets/loader-circle-DhGAlDXI.js','/assets/separator-BpOIB7rr.js','/assets/textarea-CdWIYD1l.js','/assets/submit-field-B0R-B0PH.js','/assets/use-toast-DYrZrp-R.js','/assets/scroll-area-L3FUHWQ2.js','/assets/components-CX0sUFVy.js','/assets/input-BcVCSBdC.js','/assets/dialog-DXOPFsfq.js','/assets/arrow-right-C9SmgPxt.js','/assets/index-Bw096r3b.js','/assets/react-icons.esm-rwe---N-.js','/assets/Combination-UUIhIHuY.js','/assets/component-BNoCFiKk.js','/assets/index-DKSfMDA3.js','/assets/floating-ui.react-dom-BG5e4N6P.js','/assets/index-CX1UruNB.js','/assets/index-DgbcTfU2.js','/assets/index-Ch1Hn_2w.js','/assets/index-B8TYSf5L.js'],'css':[]},'routes/sse':{'id':'routes/sse','parentId':'root','path':'sse','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/sse-l0sNRNKZ.js','imports':[],'css':[]}},'url':'/assets/manifest-5d8e09e0.js','version':'5d8e09e0'};

/**
       * `mode` is only relevant for the old Remix compiler but
       * is included here to satisfy the `ServerBuild` typings.
       */
      const mode = "production";
      const assetsBuildDirectory = "build/client";
      const basename = "/";
      const future = {"v3_fetcherPersist":true,"v3_relativeSplatPath":true,"v3_throwAbortReason":true,"v3_routeConfig":false,"v3_singleFetch":true,"v3_lazyRouteDiscovery":true,"unstable_optimizeDeps":false};
      const isSpaMode = false;
      const publicPath = "/";
      const entry = { module: entryServer };
      const routes = {
        "root": {
          id: "root",
          parentId: undefined,
          path: "",
          index: undefined,
          caseSensitive: undefined,
          module: route0
        },
  "routes/app.settings.overview": {
          id: "routes/app.settings.overview",
          parentId: "routes/app.settings",
          path: "overview",
          index: undefined,
          caseSensitive: undefined,
          module: route1
        },
  "routes/app.settings.profile": {
          id: "routes/app.settings.profile",
          parentId: "routes/app.settings",
          path: "profile",
          index: undefined,
          caseSensitive: undefined,
          module: route2
        },
  "routes/_auth.auth.callback": {
          id: "routes/_auth.auth.callback",
          parentId: "routes/_auth",
          path: "auth/callback",
          index: undefined,
          caseSensitive: undefined,
          module: route3
        },
  "routes/_auth.auth.consent": {
          id: "routes/_auth.auth.consent",
          parentId: "routes/_auth",
          path: "auth/consent",
          index: undefined,
          caseSensitive: undefined,
          module: route4
        },
  "routes/_auth.auth.login": {
          id: "routes/_auth.auth.login",
          parentId: "routes/_auth",
          path: "auth/login",
          index: undefined,
          caseSensitive: undefined,
          module: route5
        },
  "routes/_auth.auth.reset": {
          id: "routes/_auth.auth.reset",
          parentId: "routes/_auth",
          path: "auth/reset",
          index: undefined,
          caseSensitive: undefined,
          module: route6
        },
  "routes/outcomes.$action": {
          id: "routes/outcomes.$action",
          parentId: "root",
          path: "outcomes/:action",
          index: undefined,
          caseSensitive: undefined,
          module: route7
        },
  "routes/app.settings": {
          id: "routes/app.settings",
          parentId: "routes/app",
          path: "settings",
          index: undefined,
          caseSensitive: undefined,
          module: route8
        },
  "routes/app.contact": {
          id: "routes/app.contact",
          parentId: "routes/app",
          path: "contact",
          index: undefined,
          caseSensitive: undefined,
          module: route9
        },
  "routes/join.cb": {
          id: "routes/join.cb",
          parentId: "routes/join",
          path: "cb",
          index: undefined,
          caseSensitive: undefined,
          module: route10
        },
  "routes/_index": {
          id: "routes/_index",
          parentId: "root",
          path: undefined,
          index: true,
          caseSensitive: undefined,
          module: route11
        },
  "routes/logout": {
          id: "routes/logout",
          parentId: "root",
          path: "logout",
          index: undefined,
          caseSensitive: undefined,
          module: route12
        },
  "routes/mobile": {
          id: "routes/mobile",
          parentId: "root",
          path: "mobile",
          index: undefined,
          caseSensitive: undefined,
          module: route13
        },
  "routes/_auth": {
          id: "routes/_auth",
          parentId: "root",
          path: undefined,
          index: undefined,
          caseSensitive: undefined,
          module: route14
        },
  "routes/files": {
          id: "routes/files",
          parentId: "root",
          path: "files",
          index: undefined,
          caseSensitive: undefined,
          module: route15
        },
  "routes/score": {
          id: "routes/score",
          parentId: "root",
          path: "score",
          index: undefined,
          caseSensitive: undefined,
          module: route16
        },
  "routes/join": {
          id: "routes/join",
          parentId: "root",
          path: "join",
          index: undefined,
          caseSensitive: undefined,
          module: route17
        },
  "routes/test": {
          id: "routes/test",
          parentId: "root",
          path: "test",
          index: undefined,
          caseSensitive: undefined,
          module: route18
        },
  "routes/app": {
          id: "routes/app",
          parentId: "root",
          path: "app",
          index: undefined,
          caseSensitive: undefined,
          module: route19
        },
  "routes/sse": {
          id: "routes/sse",
          parentId: "root",
          path: "sse",
          index: undefined,
          caseSensitive: undefined,
          module: route20
        }
      };

export { serverManifest as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, mode, publicPath, routes };
