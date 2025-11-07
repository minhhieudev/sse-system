"use client";

import { useToast as useHeroToast } from "@heroui/toast";

import { toastMessages, getMessageFromResponse } from "@/config/messages";

/**
 * Custom hook để quản lý toast notifications
 * Wrap HeroUI toast với message management
 */
export const useToast = () => {
  const { toast } = useHeroToast();

  /**
   * Show success toast
   */
  const success = (message, options = {}) => {
    toast({
      title: message,
      variant: "success",
      duration: 3000,
      ...options,
    });
  };

  /**
   * Show error toast
   */
  const error = (message, options = {}) => {
    toast({
      title: message,
      variant: "danger",
      duration: 5000,
      ...options,
    });
  };

  /**
   * Show warning toast
   */
  const warning = (message, options = {}) => {
    toast({
      title: message,
      variant: "warning",
      duration: 4000,
      ...options,
    });
  };

  /**
   * Show info toast
   */
  const info = (message, options = {}) => {
    toast({
      title: message,
      variant: "default",
      duration: 3000,
      ...options,
    });
  };

  /**
   * Get message from config by action and resource
   */
  const getConfigMessage = (action, resource) => {
    // Convert plural to singular (orders -> order, users -> user)
    const resourceSingular = resource.endsWith("s")
      ? resource.slice(0, -1)
      : resource;

    const actionPastTense =
      {
        create: "Created",
        update: "Updated",
        delete: "Deleted",
      }[action] || action.charAt(0).toUpperCase() + action.slice(1);

    const key = `${resourceSingular}${actionPastTense}`;

    return toastMessages[key] || toastMessages.saved;
  };

  /**
   * Get error message from config by action and resource
   */
  const getConfigErrorMessage = (action, resource) => {
    // Convert plural to singular (orders -> order, users -> user)
    const resourceSingular = resource.endsWith("s")
      ? resource.slice(0, -1)
      : resource;
    const actionCapitalized = action.charAt(0).toUpperCase() + action.slice(1);
    const errorKey = `${resourceSingular}${actionCapitalized}Error`;

    return toastMessages[errorKey] || toastMessages.error;
  };

  /**
   * Show success message for CRUD action
   * Đơn giản: BE có message thì dùng, không thì dùng config
   */
  const successAction = (action, resource, response = null, options = {}) => {
    // Custom message từ options?
    if (
      options.useConfigMessage &&
      typeof options.useConfigMessage === "string"
    ) {
      success(options.useConfigMessage);

      return;
    }

    // Lấy message từ BE hoặc config
    // Format: response?.message || toastMessages.orderCreated
    const message =
      getMessageFromResponse(response) || getConfigMessage(action, resource);

    success(message);
  };

  /**
   * Show error message for CRUD action
   * Đơn giản: BE có message thì dùng, không thì dùng config
   */
  const errorAction = (action, resource, error = null, options = {}) => {
    // Custom message từ options?
    if (
      options.useConfigMessage &&
      typeof options.useConfigMessage === "string"
    ) {
      error(options.useConfigMessage);

      return;
    }

    // Lấy message từ BE hoặc config
    // Format: error?.response?.data?.message || toastMessages.orderCreateError
    const message =
      error?.response?.data?.message ||
      error?.message ||
      getConfigErrorMessage(action, resource);

    error(message);
  };

  return {
    toast,
    success,
    error,
    warning,
    info,
    successAction,
    errorAction,
  };
};

export default useToast;
