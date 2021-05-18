import { UnknownComponent } from ".";
import get from 'lodash.get';
import React from 'react';
import LandingPage from '../LandingPage';
import getSeoData from '../utils/getSeoData';
import ListingPage from '../ListingPage';
import SimplePage from '../SimplePage';

export default function Page({item, siteConfiguration, mappings}) {
    const content = get(item, "content.value[0]", null);
    const contentType = get(content, "system.type", null);

    if(!content) {
        return "loading...";
    }

    switch (contentType) {
        case "landing_page":
            return <LandingPage content={content} siteConfiguration={siteConfiguration} seo={getSeoData(item)} mappings={mappings} />;
        case "listing_page":
            return <ListingPage contentType={content.content_type.value} siteConfiguration={siteConfiguration} seo={getSeoData(item)} mappings={mappings} />;
        case "simple_page":
            return <SimplePage codename={content.system.codename} siteConfiguration={siteConfiguration} seo={getSeoData(item)} mappings={mappings} />;
        default:
            if (process.env.NODE_ENV === "development") {
                console.error(`Unknown navigation item content type: ${contentType}`);
                return (
                    <UnknownComponent>
                        <pre>{JSON.stringify(content, undefined, 2)}</pre>
                    </UnknownComponent>
                );
            }
            return null;
    }
}
