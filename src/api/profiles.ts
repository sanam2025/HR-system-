import { httpClient, unwrap } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { CreateProfilePayload, Profile, UpdateProfilePayload } from "./models";

function toProfileForm(payload: CreateProfilePayload | UpdateProfilePayload): FormData {
  const form = new FormData();
  if (payload.gender) form.append("gender", payload.gender);
  if (payload.birth_date) form.append("birth_date", payload.birth_date);
  if (payload.phone_number !== undefined) form.append("phone_number", payload.phone_number);
  if (payload.address) form.append("address", payload.address);
  if (payload.picture) form.append("picture", payload.picture);
  return form;
}

export async function createProfile(
  payload: CreateProfilePayload,
  options?: RequestOptions
): Promise<Profile> {
  const response = await httpClient.post(endpoints.profiles.create, toProfileForm(payload), options);
  const res = unwrap<Profile>(response) as any;
  return { ...res, picture_url: res.picture_url ?? res.picture ?? null } as Profile;
}

export async function getProfile(id: number, options?: RequestOptions): Promise<Profile> {
  const response = await httpClient.get(endpoints.profiles.show(id), options);
  const res = unwrap<Profile>(response) as any;
  return { ...res, picture_url: res.picture_url ?? res.picture ?? null } as Profile;
}

export async function updateProfile(
  id: number,
  payload: UpdateProfilePayload,
  options?: RequestOptions
): Promise<Profile> {
  if (payload.picture) {
    const form = toProfileForm(payload);
    form.append("_method", "PUT");
    const response = await httpClient.post(endpoints.profiles.update(id), form, options);
    const res = unwrap<Profile>(response) as any;
    return { ...res, picture_url: res.picture_url ?? res.picture ?? null } as Profile;
  }
  const response = await httpClient.put(endpoints.profiles.update(id), payload, options);
  const res = unwrap<Profile>(response) as any;
  return { ...res, picture_url: res.picture_url ?? res.picture ?? null } as Profile;
}

/** The signed-in user's own profile (manager/HR viewing "my profile"). */
export async function getMyProfile(options?: RequestOptions): Promise<Profile> {
  const response = await httpClient.get(endpoints.profiles.mine, options);
  const res = unwrap<Profile>(response) as any;
  return { ...res, picture_url: res.picture_url ?? res.picture ?? null } as Profile;
}
