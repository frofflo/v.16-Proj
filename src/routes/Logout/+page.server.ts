import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({cookies}) => {
        cookies.delete("token_id", {path: "/"});
        cookies.delete("username", {path: "/"});
        throw redirect(303, "/");
}) satisfies PageServerLoad;