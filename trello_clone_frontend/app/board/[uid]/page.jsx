"use client";
import ListsPage from "@/components/ListsPage";

export default function Board({ params }) {
	return (
		<div>
			<main>
				<ListsPage user_id={params.uid} />
			</main>
		</div>
	)
}
