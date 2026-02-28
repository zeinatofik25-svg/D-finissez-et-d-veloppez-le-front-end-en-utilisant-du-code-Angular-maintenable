// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    <T>(id: string): T;
    keys(): string[];
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Instead of using require.context (which may not be available in this environment),
// import each spec file explicitly. Add new spec imports here as tests are added.
import './app/app.component.spec';
import './app/pages/not-found/not-found.component.spec';
import './app/pages/home/home.component.spec';
import './app/pages/country/country.component.spec';
import './app/services/data/data.service.spec';
import './app/services/chart/chart.service.spec';
import './app/services/error/error.service.spec';
