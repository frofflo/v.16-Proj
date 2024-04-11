import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export const load = (async ({cookies, params}) => {
    let username = cookies.get("username")
    let id = cookies.get("token_id")
    if(!username || !id){
        throw redirect(303, "/login")
    }

    const activityName = params.logActivities
    const activity = await prisma.activity.findFirst({
        where: {
            name: activityName
        },
    });

    if(!activity){
        throw redirect(303, "/activities")
    }

    const user = await prisma.user.findFirst({where: {name: username}});

    return {username, activity, user};
}) satisfies PageServerLoad;

export const actions: Actions = {
    claimPoints: async ({ request, cookies }) => {
        const data = await request.formData();
        let username = cookies.get("username")?.toString();
        let activityPoints = data.get("activityPoints")?.toString();
    

        const User = await prisma.user.findFirst({where: {name: username}});

        if(User && username && activityPoints){
            const currentPoints = User.personalPoints || 0;
            const newPoints = activityPoints ? parseInt(activityPoints) : 0;
            await prisma.user.update({
                data: {
                    personalPoints: currentPoints + newPoints
                }, 
                where: {name: username}
            });
        } else{
            console.log("fuck")
        }
    }
  };