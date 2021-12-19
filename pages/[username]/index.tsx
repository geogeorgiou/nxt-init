import { getUserWithUsername, postToJSON, firestore } from "@lib/firebase";
import { query, collection, where, getDocs, limit, orderBy, getFirestore } from "firebase/firestore";
import UserProfile from "@components/UserProfile";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import PostFeed from "@components/PostFeed";
import { User } from "@firebase/auth";

// interface UsernameIndexSSRProps {
// 	query: queryParam;
// }

export type UserType = {
	user: User | null;
};

export async function getServerSideProps({ query: urlQuery }: any) {
	const { username } = urlQuery;

	const userDoc = await getUserWithUsername(username);

	// If no user, short circuit to 404 page
	// if (!userDoc) {
	// 	return {
	// 		notFound: true,
	// 	};
	// }

	// JSON serializable data
	let user = null;
	let posts = null;

	if (userDoc) {
		user = userDoc.data();
		// const postsQuery = userDoc.ref
		//   .collection('posts')
		//   .where('published', '==', true)
		//   .orderBy('createdAt', 'desc')
		//   .limit(5);

		const postsQuery = query(
			collection(getFirestore(), userDoc.ref.path, "posts"),
			where("published", "==", true),
			orderBy("createdAt", "desc"),
			limit(5)
		);
		posts = (await getDocs(postsQuery)).docs.map(postToJSON);
	}

	return {
		props: { user, posts }, // will be passed to the page component as props
	};
}

export default function UserProfilePage({ user, posts }: any) {
	return (
		<main>
			{/* <Metatags title={user.username} description={`${user.username}'s public profile`} /> */}
			<UserProfile user={user} />
			<PostFeed posts={posts} admin={false} />
		</main>
	);
}
