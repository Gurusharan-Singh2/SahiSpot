export const normalizeRole = (role) => {
  const value = String(role || "user").trim().toLowerCase();

  if (value === "owner") {
    return "owner";
  }

  if (value === "admin") {
    return "admin";
  }

  if (value === "super_admin" || value === "super-admin" || value === "superadmin") {
    return "super_admin";
  }

  return "user";
};

export const canManageParking = (role) => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === "owner";
};

export const isAdminRole = (role) => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === "admin" || normalizedRole === "super_admin";
};

export const getDefaultRouteForRole = (role) => {
  if (isAdminRole(role)) {
    return "/admin";
  }

  return canManageParking(role) ? "/manage-parking" : "/find-parking";
};

export const mergeUserWithRoleFallback = (user, fallback = {}) => {
  const mergedUser = {
    ...fallback,
    ...(user || {}),
  };

  return {
    ...mergedUser,
    role: normalizeRole(mergedUser.role ?? fallback.role),
  };
};

export const normalizeUserProfile = (user, fallback = {}) => {
  const mergedUser = mergeUserWithRoleFallback(user, fallback);

  return {
    ...mergedUser,
    id: String(mergedUser.id ?? mergedUser.user_id ?? mergedUser.userId ?? fallback.id ?? ""),
    name: mergedUser.name ?? fallback.name ?? "",
    email: mergedUser.email ?? fallback.email ?? "",
    phoneNumber:
      mergedUser.phone_number ??
      mergedUser.phoneNumber ??
      mergedUser.phone ??
      fallback.phoneNumber ??
      "",
    image:
      mergedUser.img ??
      mergedUser.image ??
      mergedUser.photo ??
      mergedUser.avatar ??
      fallback.image ??
      "",
  };
};
