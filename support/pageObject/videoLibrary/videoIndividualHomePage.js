/**
 * @author Shahil Azmayish
 * @since 08/16/2026
 */

import { expect } from '@playwright/test';
import { CommonButtons } from '../../commonUtility/commonButtons.js';
import { DonePage } from '../../commonPages/donePage.js';
import { VideoFormPage } from './videoFormPage.js';
import { VideoLabels } from './utility/videoLabels.js';

const CAROUSEL_MAX_SWIPES = 10; // Max clicks to find the video
const CAROUSEL_SWIPE_DELAY_MS = 1000; // Wait after a click for animation
const CAROUSEL_POLL_TIMEOUT = CAROUSEL_MAX_SWIPES * (CAROUSEL_SWIPE_DELAY_MS + 500); // Total time to find the video

export class VideoIndividualHomePage {
	constructor(page) {
		this.page = page;
		this.commonButtons = new CommonButtons(page);
		this.videoFormPage = new VideoFormPage(page);
		this.#initializeLocators(page);
	}

	async goToIndividualHomePage(data) {
		await this.page.goto('ma/home/t/individual_home');
		await this.page.waitForLoadState('domcontentloaded');
		await this.txtSearchClientIndividualHomePage.fill(data.individualName);
		await this.lnkFirstIhpLookupResult.waitFor({ state: 'visible' });
		await this.lnkFirstIhpLookupResult.click();
		await this.commonButtons.clickButton(VideoLabels.ABOUT_ME);
		await this.btnVideoCarousel.waitFor({ state: 'visible' });
	}

	async downloadVideoFromIHP() {
		await this.videoFormPage.handleDownloadWithProgressBar(() => this.btnActiveDownload.click());
	}

	async playVideoFromIHP() {
		await this.videoFormPage.playVideo();
	}

	async updateVideoFromIHP(data) {
		const page1Promise = this.page.waitForEvent('popup');
		await this.cntActiveCarouselItem.getByRole('button', { name: VideoLabels.VIEW_FORM }).click();

		const newTab = await page1Promise;
		const donePageForNewTab = new DonePage(newTab);
		const videoFormPageForNewTab = new VideoFormPage(newTab);
		await videoFormPageForNewTab.updateVideo(data);
		await donePageForNewTab.verifyPartialDoneMessage(data.doneMessage);
		await newTab.close();
	}

	async findVideoFromAboutMe(videoTitle) {
		await expect.poll(async () => {
			const currentTitle = await this.lblVideoTitle.textContent();

			if (currentTitle.trim() === videoTitle.videoTitleIndHomeAboutMe) {
				return true;
			}

			await this.btnCarouselNext.click();
			return false;
		}, {
			message: `Video with title '${videoTitle.videoTitleIndHomeAboutMe}' did not appear in the carousel.`,
			intervals: [CAROUSEL_SWIPE_DELAY_MS],
			timeout: CAROUSEL_POLL_TIMEOUT
		}).toBe(true);
	}

	#initializeLocators(page) {
		this.txtSearchClientIndividualHomePage = page.locator('#ihpSearchInput');        
		this.lnkFirstIhpLookupResult = page.locator('#searchResults a.list-group-item').first();
		this.btnVideoCarousel = page.locator('#video-carousel');
		this.btnCarouselNext = page.locator('#video-carousel .right.carousel-control');
		this.cntActiveCarouselItem = page.locator('#video-carousel .item.active');
		this.lblVideoTitle = page.locator('#video-title');
		this.btnActiveDownload = this.cntActiveCarouselItem.locator('button[id^="video-download-"]');
	}
}
