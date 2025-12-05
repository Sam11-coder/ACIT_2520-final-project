"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { addPost, editPost, deletePost, addComment, getPost } from "./lib/db";
import { getCurrentUser } from "./lib/auth-helpers";
import { prisma } from "./lib/db";
import { auth } from "./lib/auth";

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });
  } catch (error: unknown) {
    const msg = (error as { message: string }).message;
    return redirect("/login?error=" + msg);
  }

  redirect("/posts");
}

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
    headers: await headers(),
  });

  redirect("/posts");
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/");
}

export async function createPostAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const title = formData.get("title") as string;
  const link = formData.get("link") as string;
  const description = formData.get("description") as string;
  const subgroup = formData.get("subgroup") as string;

  if (!title || !link || !description || !subgroup) {
    redirect("/posts/create?error=All fields are required");
  }

  const post = await addPost(title, link, user.id, description, subgroup);

  redirect(`/posts/${post.id}`);
}

export async function editPostAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const postId = parseInt(formData.get("postId") as string);
  const post = await getPost(postId);

  if (!post || post.creator.id !== user.id) {
    redirect(`/posts/${postId}?error=Unauthorized`);
  }

  const title = formData.get("title") as string;
  const link = formData.get("link") as string;
  const description = formData.get("description") as string;
  const subgroup = formData.get("subgroup") as string;

  if (!title || !link || !description || !subgroup) {
    redirect(`/posts/${postId}/edit?error=All fields are required`);
  }

  await editPost(postId, { title, link, description, subgroup });

  redirect(`/posts/${postId}`);
}

export async function deletePostAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const postId = parseInt(formData.get("postId") as string);
  const post = await getPost(postId);

  if (!post || post.creator.id !== user.id) {
    redirect(`/posts/${postId}?error=Unauthorized`);
  }

  await deletePost(postId);

  redirect("/posts");
}

export async function createCommentAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const postId = parseInt(formData.get("postId") as string);
  const description = formData.get("description") as string;

  if (!description) {
    redirect(`/posts/${postId}?error=Comment cannot be empty`);
  }

  await addComment(postId, user.id, description);

  revalidatePath(`/posts/${postId}`);
}

export async function updateProfileImageAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const imageUrl = formData.get("imageUrl") as string;

  if (!imageUrl) {
    redirect("/settings?error=Image URL is required");
  }

  // Update user's image in database
  await prisma.user.update({
    where: { id: user.id },
    data: { image: imageUrl },
  });

  redirect("/settings?success=Profile picture updated");
}
