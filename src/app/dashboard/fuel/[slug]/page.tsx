import React from 'react';

async function Page({params}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    if (slug === "new") {
        return (
            <div>Create</div>
        )
    }

    return (
        <div>test</div>
    );
}

export default Page;