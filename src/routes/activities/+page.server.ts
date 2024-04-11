import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from '../activities/$types';
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export const load = (async ({cookies}) => {
    let username = cookies.get("username")
    let id = cookies.get("token_id")
    if(!id){
        throw redirect(303, "/Login")    
    }
    const activityList = await prisma.activity.findMany({select: {isFavoritedBy: true, name: true, id: true, description: true, estTime: true, activityPoints: true, username: true, user: {select: {name: true}}}})

    return {username, activityList};
}) satisfies PageServerLoad;


export const actions: Actions = {
    create: async ({request, cookies}) => {
        let data = await request.formData();
        let username = cookies.get("username")?.toString();
        let activityName = data.get("activityName")?.toString();
        let description = data.get("description")?.toString();
        let estTime = data.get("estTime")?.toString();
        let activityPoints = data.get("activityPoints")?.toString();

        if(!activityName){
            return fail(400, {activityName: "Aktivitetsnamn saknas."})
        }
        else if(!description){
            return fail(400, {activityName: "Beskrivning saknas."})
        }
        else if(!estTime){
            return fail(400, {activityName: "Ungefärlig tid saknas."})
        }
        else if(!activityPoints){
            return fail(400, {activityName: "Aktivitetspoäng saknas."})
        }
        
        else if(await prisma.activity.findFirst({where: {name: activityName?.toString()}})){
            return fail(400, {activityName: "Aktiviteten finns redan. Välj ett annat namn."})
        }

        const User = await prisma.user.findFirst({where: {name: username}});
        if(User && username && description && estTime && activityPoints){
            await prisma.activity.create({data: {
                name: activityName?.toString(),
                username: username?.toString(),
                description: description?.toString(),
                estTime: estTime ? parseInt(estTime) : 0,
                activityPoints: activityPoints ? parseInt(activityPoints) : 0,
                user: { connect: { name: username } },                
            }})
        } else{
            return fail(400, {activityName: "Unable to find user."})
        }        
        
    },
    addFavorite: async ({request, cookies}) => {
        let data = await request.formData();
        let username = cookies.get("username")?.toString();
        let activityName = data.get("activityName")?.toString();
        let activityId = parseInt(data.get("activityId")?.toString() ?? "0");

        const activity = await prisma.activity.findUnique({where: {id: activityId, name: activityName}, select: {isFavoritedBy: true}})
        if (!activity){
            return fail(400, {activityName: "Unable to find activity."})
        }

        const user = await prisma.user.findFirst({where: {name: username}})

        if (!user){
            return fail(400, {activityName: "Unable to find user."})
        }

        await prisma.activity.update({where: {id: activityId, name: activityName}, data: {isFavoritedBy: {connect: {name: username}}}})

    },
    removeFavorite: async ({request, cookies}) => {
        let data = await request.formData();
        let username = cookies.get("username")?.toString();
        let activityName = data.get("activityName")?.toString();
        let activityId = parseInt(data.get("activityId")?.toString() ?? "0");

        const activity = await prisma.activity.findUnique({where: {id: activityId, name: activityName}, select: {isFavoritedBy: true}})
        if (!activity){
            return fail(400, {activityName: "Unable to find activity."})
        }

        const user = await prisma.user.findFirst({where: {name: username}})

        if (!user){
            return fail(400, {activityName: "Unable to find user."})
        }

        await prisma.activity.update({where: {id: activityId, name: activityName}, data: {isFavoritedBy: {disconnect: {name: username}}}})

    },
}