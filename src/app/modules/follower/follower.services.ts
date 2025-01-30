import { IFollower } from "./follower.interface"
import { Follower } from "./follower.model";


const followAndUnfollow = async (data: IFollower) => {
    if (data?.follower_id === data?.following_id) {
        throw new Error("You cannot follow yourself.");
    }

    const existingFollow = await Follower.findOne({
        follower_id: data?.follower_id,
        following_id: data?.following_id,
    });

    if (existingFollow) {
        // If already following, unfollow (delete record)
        await Follower.deleteOne({
            follower_id: data?.follower_id,
            following_id: data?.following_id,
        });
        return { message: "Unfollowed successfully!" };
    } else {
        // If not following, follow (insert new record)
        await Follower.create({
            follower_id: data?.follower_id,
            following_id: data?.following_id,
        });

        return { message: "Followed successfully!" };
    }
}

const getMyfollower = async (user: any) => {
    const followers = await Follower.find({ following_id: user.id })
        .populate({
            path: "follower_id",
            select: "profileImageUrl firstName lastName", // Select only the required fields
            populate: [
                {
                    path: "trainerDetails", // Populate trainer details if the user is a trainer
                    select: "profileImageUrl firstName lastName",
                },
                {
                    path: "traineeDetails", // Populate trainee details if the user is a trainee
                    select: "profileImageUrl firstName lastName",
                },
            ],
        });

    // Format the response to include profileImageUrl and name
    // const formattedFollowers = followers.map((follower) => {
    //     const user = follower.follower_id;
    //     const profileImageUrl = user.trainerDetails?.profileImageUrl || user.traineeDetails?.profileImageUrl;
    //     const name = user.trainerDetails
    //         ? `${user.trainerDetails.firstName} ${user.trainerDetails.lastName}`
    //         : `${user.traineeDetails.firstName} ${user.traineeDetails.lastName}`;

    //     return {
    //         _id: user._id,
    //         profileImageUrl,
    //         name,
    //     };
    // });

    // return formattedFollowers;
    console.log(followers);
}

export const followAndUnfollowServices = {
    followAndUnfollow,
    getMyfollower,
}