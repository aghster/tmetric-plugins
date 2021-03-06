﻿class YouTrack implements WebToolIntegration {

    showIssueId = true;

    observeMutations = true;

    matchUrl = [
        '*://*/issue/*',
        '*://*/agiles/*'
    ];

    issueElementSelector = '.yt-issue-view, yt-agile-card';

    render(issueElement: HTMLElement, linkElement: HTMLElement) {
        let host =
            $$('.yt-issue-view__meta-information', issueElement) ||
            $$('.yt-issue-toolbar', issueElement) ||
            $$('.yt-agile-card__summary', issueElement);

        if (host) {
            host.appendChild(linkElement);
        }
    }

    getIssue(issueElement: HTMLElement, source: Source): WebToolIssue {

        let issueName =
            $$.try('.yt-issue-body__summary', issueElement).textContent || // single task
            $$.try('yt-agile-card__summary > span', issueElement).textContent; // agile board

        if (!issueName) {
            return;
        }

        let linkElement = $$('.yt-issue-id', issueElement);

        let issueId = linkElement && linkElement.textContent;

        let issueUrl = linkElement && linkElement.getAttribute('href');

        let projectName = $$.try('yt-issue-project', issueElement).textContent;

        let tagNames = $$.all('.yt-issue-tags__tag__name', issueElement).map(_ => _.textContent);

        let serviceType = 'YouTrack';

        let serviceUrl = (<HTMLBaseElement>$$.try('base')).href;

        return { issueId, issueName, projectName, tagNames, serviceType, serviceUrl, issueUrl };
    }
}

class YouTrackOld implements WebToolIntegration {

    showIssueId = true;

    observeMutations = true;

    matchUrl = '*://*/issue/*';

    issueElementSelector = '.content_fsi .toolbar_fsi';

    render(issueElement: HTMLElement, linkElement: HTMLElement) {
        issueElement.appendChild(linkElement);
    }

    getIssue(issueElement: HTMLElement, source: Source): WebToolIssue {

        // Full url:
        // https://HOST/PATH/issue/ISSUE_ID#PARAMETERS
        var match = /^(.+)\/issue\/(.+)$/.exec(source.fullUrl);
        if (!match) {
            return;
        }

        var issueId = $$.try('.issueId', issueElement).textContent;
        if (!issueId) {
            return;
        }

        var issueName = $$.try('.issue-summary', issueElement).textContent;
        if (!issueName) {
            return;
        }

        var projectName = $$.try('.fsi-properties .fsi-property .attribute.bold').textContent;

        var serviceType = 'YouTrack';

        var serviceUrl = match[1];

        var issueUrl = 'issue/' + issueId;

        return { issueId, issueName, projectName, serviceType, serviceUrl, issueUrl };
    }
}

class YouTrackBoardOld implements WebToolIntegration {

    showIssueId = true;

    observeMutations = true;

    matchUrl = '*://*/rest/agile/*/sprint/*';

    issueElementSelector = '#editIssueDialog';

    render(issueElement: HTMLElement, linkElement: HTMLElement) {
        var host = $$('.sb-issue-edit-id', issueElement);
        if (host) {
            host.parentElement.insertBefore(linkElement, host.nextElementSibling);
        }
    }

    getIssue(issueElement: HTMLElement, source: Source): WebToolIssue {

        // Full url:
        // https://HOST/PATH/rest/agile/*/sprint/*
        var match = /^(.+)\/rest\/agile\/(.+)$/.exec(source.fullUrl);
        if (!match) {
            return;
        }

        var issueId = $$.try('.sb-issue-edit-id', issueElement).textContent;
        if (!issueId) {
            return;
        }

        var issueName =
            $$.try<HTMLInputElement>('.sb-issue-edit-summary input', issueElement).value || // logged in
            $$.try('.sb-issue-edit-summary.sb-disabled', issueElement).textContent; // not logged in
        if (!issueName) {
            return;
        }

        // project name can be resolved for logged in users only
        var projectSelector = $$('.sb-agile-dlg-projects');
        if (projectSelector) {
            var projectName = $$.try('label[for=editAgileProjects_' + issueId.split('-')[0] + ']', projectSelector).textContent;
        }

        var serviceType = 'YouTrack';

        var serviceUrl = match[1];

        var issueUrl = 'issue/' + issueId;

        return { issueId, issueName, projectName, serviceType, serviceUrl, issueUrl };
    }
}

IntegrationService.register(new YouTrack(), new YouTrackOld(), new YouTrackBoardOld());